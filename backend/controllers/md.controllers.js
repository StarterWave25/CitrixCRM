import dotenv from 'dotenv';
import { pool } from '../database/db.js';
import bcrypt from 'bcryptjs';
import { encryptMetadata, decryptMetadata } from "../lib/encrypt.js";

dotenv.config();

// Assuming formRegistry is stored as a JSON string in the environment, as you mentioned.
const FORM_REGISTRY = JSON.parse(process.env.FORM_REGISTRY_JSON || '{}');

// Simple, production-ready validation helper (since external libraries like AJV are unavailable)
const validateData = (data, schema) => {
    const errors = [];
    const requiredFields = schema.required || [];

    // Check for required fields
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            errors.push(`Missing required field: '${field}'`);
        }
    }

    // Basic type and length checks (can be expanded for production)
    for (const [key, prop] of Object.entries(schema.properties || {})) {
        const value = data[key];
        if (value !== undefined && value !== null) {
            if (prop.type === 'string' && typeof value !== 'string') {
                errors.push(`Field '${key}' must be a string.`);
            }
            if (prop.type === 'integer' && !Number.isInteger(value)) {
                errors.push(`Field '${key}' must be an integer.`);
            }
            if (prop.maxLength && String(value).length > prop.maxLength) {
                errors.push(`Field '${key}' exceeds max length of ${prop.maxLength}.`);
            }
            // Add checks for minLength, minimum, maximum, and pattern here for full validation...
        }
    }

    return errors.length > 0 ? errors : null;
};

/**
 * Controller to dynamically add new entities (Boss, Employee, Manager, etc.)
 * based on the FORM_REGISTRY configuration.
 * * Request body structure: { form: "entityKey", data: { field1: value1, ... } }
 */
export const addEntity = async (req, res) => {
    const { form, data } = req.body;

    // 1. Initial Request Validation
    if (!form || !data) {
        return res.status(400).json({
            success: false,
            message: "Request body must contain 'form' (entity key) and 'data' (payload)."
        });
    }

    const entityConfig = FORM_REGISTRY[form];

    if (!entityConfig) {
        return res.status(400).json({
            success: false,
            message: `Invalid form key: '${form}'. Entity not found in registry.`
        });
    }

    // 2. Schema Validation using the registry
    const validationErrors = validateData(data, entityConfig.jsonSchema);

    if (validationErrors) {
        console.warn(`Validation failed for form ${form}:`, validationErrors);
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            data: { errors: validationErrors }
        });
    }

    try {
        let payload = { ...data }; // Copy data to work with

        // 3. Encrypt Passwords if the field exists
        if (payload.password) {
            // Salt generation and hashing are asynchronous.
            const SALT_ROUNDS = await bcrypt.genSalt(10);
            payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
        }

        // 4. Prepare SQL Query
        const tableName = entityConfig.table;
        const dbColumns = [];
        const placeholders = [];
        const values = [];

        // Iterate over the structured columns to ensure correct order and mapping
        for (const col of entityConfig.columns) {
            // Use backticks for column names with spaces (like "Employee Name") or keywords
            dbColumns.push(`\`${col.db}\``);
            placeholders.push('?');
            values.push(payload[col.name]);
        }

        const query = `INSERT INTO \`${tableName}\` (${dbColumns.join(', ')}) VALUES (${placeholders.join(', ')})`;

        // 5. Execute Query
        const [result] = await pool.query(query, values);

        // 6. Respond with Success
        return res.status(201).json({
            success: true,
            message: `${entityConfig.table} added successfully.`,
            data: { insertedId: result.insertId, rowCount: result.affectedRows }
        });

    } catch (error) {
        console.error(`Database or Internal Error during entity creation for ${form}:`, error);
        // Specifically check for common MySQL duplicate entry errors (Code 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Employee already exists!"
            });
        }
        if (error.errno === 1452) {
            return res.status(409).json({
                success: false,
                message: "No Headquarter present!"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during data insertion."
        });
    }
};

/**
 * Controller function to view various entities for the MD role.
 * Expected Request Body: { entity: string, hqId?: number, exId?: number }
 */

export const viewEntity = async (req, res) => {
    // Helper to send standardized response
    const sendResponse = (success, message, data = {}) => {
        return res.status(success ? 200 : 400).json({ success, message, data });
    };

    // --- Data Transformation Helper (Assume it's imported or defined) ---
    // This is the core logic from the previous answer, tailored slightly for clarity.
    const transformDataForCellMetadata = (row, tableName, idName, columnsToEncrypt) => {
        const transformedRow = {};
        const idValue = row[idName];

        for (const key in row) {
            const columnValue = row[key];

            if (columnsToEncrypt.includes(key)) {
                // Encrypt the metadata (table, idName, key)
                const metadata = {
                    table: tableName,
                    idName: idName,
                    idValue: idValue,
                    columnName: key,
                };
                // The encryption function is assumed to be imported (encryptMetadata)
                const encryptedMeta = encryptMetadata(metadata);

                transformedRow[key] = {
                    meta: encryptedMeta, // Encrypted metadata string
                    value: columnValue   // Original value for display
                };

            } else {
                // Columns like IDs, Date, or non-editable fields (hqName, extensionName in certain views)
                transformedRow[key] = {
                    value: columnValue
                };
            }
        }
        return transformedRow;
    };
    // ----------------------------------------------------------------------

    try {
        if (!pool) return res.status(500).json({ success: false, message: 'DB pool not configured' });

        const { entity, hqId, exId } = req.body || {};

        if (!entity) {
            return sendResponse(false, 'Missing required entity parameter.');
        }

        let sql = '';
        let params = [];
        let tableName = '';
        let idName = '';
        let columnsToEncrypt = [];
        let resultKey = entity;

        // --- CORE LOGIC: Entity-specific configuration ---
        switch (entity.toLowerCase()) {
            case 'employees':
                // 1. Employees View (MD Selects employees)
                tableName = 'employees';
                idName = 'empId';
                columnsToEncrypt = ['empName', 'hqName']; // hqName is from JOIN
                resultKey = 'employeesList';

                sql = `
                    SELECT
                        e.\`empId\`,
                        e.\`empName\`,
                        h.\`hqName\`
                    FROM \`employees\` e
                    INNER JOIN \`headquarters\` h ON e.\`hqId\` = h.\`hqId\`
                    ORDER BY e.\`empName\` ASC
                `;
                break;

            case 'extensions':
                // 1. Employees (Extensions by hqId) OR 4. Doctors (Extensions by hqId)
                if (!hqId || !Number.isInteger(Number(hqId))) {
                    return sendResponse(false, 'Missing or invalid hqId for extensions view.');
                }
                tableName = 'extensions';
                idName = 'exId';
                // Only generate meta data if it's for the 'Employees' scenario (based on the user's explicit request)
                columnsToEncrypt = req.body.origin === 'employees' ? ['extensionName'] : [];
                params.push(Number(hqId));
                resultKey = 'extensionsList';

                sql = `
                    SELECT 
                        \`exId\`, 
                        \`extensionName\`
                    FROM \`extensions\`
                    WHERE \`hqId\` = ?
                    ORDER BY \`extensionName\` ASC
                `;
                break;

            case 'stockists':
                // 2. Stockists View
                tableName = 'stockists';
                idName = 'stockId';
                columnsToEncrypt = ['Stockist Name', 'Phone']; // extensionName should NOT have meta data
                resultKey = 'stockistsList';

                sql = `
                    SELECT 
                        s.\`stockId\`, 
                        s.\`Stockist Name\`, 
                        s.\`Phone\`,
                        GROUP_CONCAT(e.\`extensionName\` SEPARATOR ', ') AS \`extensionName\`
                    FROM \`stockists\` s
                    LEFT JOIN \`extensions\` e ON e.\`stockId\` = s.\`stockId\`
                    GROUP BY s.\`stockId\`, s.\`Stockist Name\`, s.\`Phone\`
                    ORDER BY s.\`Stockist Name\` ASC
                `;
                break;

            case 'products':
                // 3. Products View
                tableName = 'products';
                idName = 'pId';
                // Note: The schema has Product Name and Date as INT. Assuming they should be VARCHAR/DATE for editing.
                columnsToEncrypt = ['Product Name', 'Price'];
                resultKey = 'productsList';

                sql = `
                    SELECT 
                        \`pId\`, 
                        \`Product Name\`, 
                        \`Price\`
                    FROM \`products\`
                    ORDER BY \`Product Name\` ASC
                `;
                break;

            case 'headquarters':
                // 4. Doctors (First step)
                tableName = 'headquarters';
                idName = 'hqId';
                columnsToEncrypt = []; // hqName - Don't generate meta data
                resultKey = 'headquartersList';

                sql = `
                    SELECT 
                        \`hqId\`, 
                        \`hqName\`
                    FROM \`headquarters\`
                    ORDER BY \`hqName\` ASC
                `;
                break;

            case 'doctors':
                // 4. Doctors (Final step)
                if (!exId || !Number.isInteger(Number(exId))) {
                    return sendResponse(false, 'Missing or invalid exId for doctors view.');
                }
                tableName = 'doctors';
                idName = 'docId';
                columnsToEncrypt = ['Doctor Name', 'Phone', 'Address', 'Status'];
                params.push(Number(exId));
                resultKey = 'doctorsList';

                sql = `
                    SELECT
                        \`docId\`,
                        \`Doctor Name\`,
                        \`Phone\`,
                        \`Address\`,
                        \`Status\`
                    FROM \`doctors\`
                    WHERE \`exId\` = ?
                    ORDER BY \`Doctor Name\` ASC
                `;
                break;

            case 'manager':
                // 5. Managers View
                tableName = 'manager';
                idName = 'manId';
                columnsToEncrypt = ['manName', 'email'];
                resultKey = 'managersList';

                sql = `
                    SELECT 
                        \`manId\`, 
                        \`manName\`, 
                        \`email\`
                    FROM \`manager\`
                    ORDER BY \`manName\` ASC
                `;
                break;

            case 'md':
            case 'boss': // Use 'boss' table name from schema for MDs
                // 6. MDs View (boss table)
                tableName = 'boss';
                idName = 'bossId';
                columnsToEncrypt = ['bossName', 'email'];
                resultKey = 'mdsList';

                sql = `
                    SELECT 
                        \`bossId\`, 
                        \`bossName\`, 
                        \`email\`
                    FROM \`boss\`
                    ORDER BY \`bossName\` ASC
                `;
                break;

            default:
                return sendResponse(false, `Invalid entity: ${entity}.`);
        }

        // --- Execution and Transformation ---
        const [rows] = await pool.execute(sql, params);

        const transformedData = (rows || []).map(row =>
            transformDataForCellMetadata(row, tableName, idName, columnsToEncrypt)
        );

        return sendResponse(true, `${resultKey} fetched successfully.`, { [resultKey]: transformedData });

    } catch (err) {
        console.error('viewMDData error', err);
        // Use 500 status code for internal server errors
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Controller function to update all unpaid expenses for a given employee to 'Paid'.
 * Expected Request Body: { "empId": 2 }
*/
export const payExpenses = async (req, res) => {
    // 1. Extract and validate empId from the request body
    const empId = parseInt(req.body.empId, 10);
    const method = req.body.method;

    if (isNaN(empId) || empId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid employee ID format provided in request body.' });
    }

    if (!method && method != 'UPI' && method != 'BANK') {
        return res.status(400).json({ success: false, message: 'Invalid Payment method' });
    }

    try {
        const tableName = 'expenses';
        const paidStatusColumn = 'Paid Status';

        // 2. Construct the parameterized SQL UPDATE query
        const sql = `
            UPDATE \`${tableName}\`
            SET \`${paidStatusColumn}\` = 'Paid', \`Paid on\` = CURDATE(), \`Method\` = ?
            WHERE 
                empId = ? 
                AND \`${paidStatusColumn}\` = 'Not Paid'
        `;
        const values = [method, empId];

        // 3. Execute the query
        const [result] = await pool.execute(sql, values);

        const affectedRows = result.affectedRows;

        if (affectedRows === 0) {
            // Check if the employee ID exists at all to provide a more specific error
            const [checkRows] = await pool.execute(
                `SELECT 1 FROM \`${tableName}\` WHERE empId = ? LIMIT 1`,
                [empId]
            );

            if (checkRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Employee ID ${empId} not found in the expenses table.`
                });
            }

            // If the employee exists but affectedRows is 0, all expenses are already paid
            return res.status(200).json({
                success: true,
                message: `All existing expenses for empId ${empId} are already marked as 'Paid'.`,
                affectedRows: 0
            });
        }

        // 4. Return success message and the number of rows updated
        return res.status(200).json({
            success: true,
            message: `Successfully updated ${affectedRows} expense record(s) to 'Paid' for empId ${empId}.`,
            data: { affectedRows: affectedRows }
        });

    } catch (err) {
        console.error(`Pay Expenses error for empId ${empId}:`, err);
        return res.status(500).json({ success: false, message: 'Internal server error during expense payment update.' });
    }
};

/**
 * Dynamically updates a single column (cell) in a specified database table using encrypted metadata.
 * * Request body structure:
 * @param {string} encryptedMetadata - Base64-encoded string containing { table, idName, idValue, columnName }.
 * @param {any} columnValue   - The new value for the specified column.
 */
export const editCell = async (req, res) => {
    const { encryptedMetadata, columnValue } = req.body;

    // 1. Initial Input Validation
    if (!encryptedMetadata || columnValue === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: encryptedMetadata and columnValue must be provided."
        });
    }

    let tableName, IdName, IdValue, columnName;

    try {
        // 2. Decrypt Metadata and extract variables
        const decrypted = decryptMetadata(encryptedMetadata);
        // Map decrypted keys to local variables
        tableName = decrypted.table;
        IdName = decrypted.idName;
        IdValue = decrypted.idValue;
        columnName = decrypted.columnName;
    } catch (e) {
        // Handle errors thrown during decryption (e.g., corrupted token, invalid JSON)
        console.error('Decryption failed on request:', e.message);
        return res.status(401).json({
            success: false,
            message: "Authentication failure: Invalid or corrupted access token (metadata)."
        });
    }

    // 3. Security Check (Prevent updating reserved system columns like 'date')
    const disallowedColumns = ['date', 'created_at', 'updated_at'];
    if (disallowedColumns.includes(columnName.toLowerCase()) && columnName.toLowerCase() !== 'password') {
        return res.status(403).json({
            success: false,
            // FIXED: Used template literal backticks for the message string
            message: `Updating column '${columnName}' is restricted via this endpoint.`
        });
    }

    try {
        // 5. Construct the Dynamic SQL Query
        // FIXED: Used backticks (`) for the template literal and correctly interpolated variables, 
        // while also enclosing dynamic table and column names in SQL backticks (`).
        const query = `
            UPDATE \`${tableName}\`
            SET \`${columnName}\` = ?
            WHERE \`${IdName}\` = ?
        `;

        const values = [columnValue, IdValue];

        // 6. Execute the Query
        const [result] = await pool.query(query, values);

        // 7. Handle Response
        if (result.affectedRows === 0) {
            // Check if the ID exists but the row wasn't modified, or if the ID simply doesn't exist
            // FIXED: Corrected syntax for the second query (checkRows)
            const [checkRows] = await pool.query(`SELECT 1 FROM \`${tableName}\` WHERE \`${IdName}\` = ?`, [IdValue]);

            if (checkRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    // FIXED: Used template literal backticks for the message string
                    message: `Row not found in table '${tableName}' with ${IdName} = ${IdValue}.`
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Update successful, but the new value was the same as the old value (0 rows affected)."
                });
            }
        }

        return res.status(200).json({
            success: true,
            // FIXED: Used template literal backticks for the message string
            message: `${result.affectedRows} row(s) updated successfully in table '${tableName}'.`,
            data: {
                info: {
                    updatedColumn: columnName,
                    newValue: columnValue, // Now correctly defined
                }
            }
        });

    } catch (error) {
        // FIXED: Used template literal backticks for error logging
        console.error(`Database Error during editCell operation on table ${tableName}:`, error);

        // Check for specific database errors
        if (error.code === 'ER_NO_SUCH_TABLE') {
            // FIXED: Used template literal backticks for the message string
            return res.status(404).json({ success: false, message: `Table '${tableName}' does not exist.` });
        }
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            // FIXED: Used template literal backticks for the message string
            return res.status(400).json({ success: false, message: `Column '${columnName}' or identifier '${IdName}' does not exist in table '${tableName}'.` });
        }

        // Generic internal error
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during data update."
        });
    }
};