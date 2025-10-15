import dotenv from 'dotenv';
import { pool } from '../database/db.js';
import bcrypt from 'bcryptjs';

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
export const addEntities = async (req, res) => {
    const { form, data } = req.body;

    // 1. Initial Request Validation
    if (!form || !data) {
        return res.status(400).json({
            ok: false,
            message: "Request body must contain 'form' (entity key) and 'data' (payload)."
        });
    }

    const entityConfig = FORM_REGISTRY[form];

    if (!entityConfig) {
        return res.status(400).json({
            ok: false,
            message: `Invalid form key: '${form}'. Entity not found in registry.`
        });
    }

    // 2. Schema Validation using the registry
    const validationErrors = validateData(data, entityConfig.jsonSchema);

    if (validationErrors) {
        console.warn(`Validation failed for form ${form}:`, validationErrors);
        return res.status(400).json({
            ok: false,
            message: "Validation Error",
            errors: validationErrors
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
            ok: true,
            message: `${entityConfig.table} added successfully.`,
            insertedId: result.insertId,
            rowCount: result.affectedRows
        });

    } catch (error) {
        console.error(`Database or Internal Error during entity creation for ${form}:`, error);
        // Specifically check for common MySQL duplicate entry errors (Code 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                ok: false,
                message: "Employee already exists!"
            });
        }
        if (error.errno === 1452) {
            return res.status(409).json({
                ok: false,
                message: "No Headquarter present!"
            });
        }
        return res.status(500).json({
            ok: false,
            message: "Internal Server Error during data insertion."
        });
    }
};

/**
 * Controller function to update all unpaid expenses for a given employee to 'Paid'.
 * Expected Request Body: { "empId": 2 }
*/
export const payExpenses = async (req, res) => {
    // 1. Extract and validate empId from the request body
    const empId = parseInt(req.body.empId, 10);

    if (isNaN(empId) || empId <= 0) {
        return res.status(400).json({ error: 'Invalid employee ID format provided in request body.' });
    }

    try {
        const tableName = 'expenses';
        const paidStatusColumn = 'Paid Status';

        // 2. Construct the parameterized SQL UPDATE query
        const sql = `
            UPDATE \`${tableName}\`
            SET \`${paidStatusColumn}\` = 'Paid' 
            WHERE 
                empId = ? 
                AND \`${paidStatusColumn}\` = 'Not Paid'
        `;
        const values = [empId];

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
                    message: `Employee ID ${empId} not found in the expenses table.`,
                    affectedRows: 0
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
        return res.json({
            success: true,
            message: `Successfully updated ${affectedRows} expense record(s) to 'Paid' for empId ${empId}.`,
            affectedRows: affectedRows
        });

    } catch (err) {
        console.error(`Pay Expenses error for empId ${empId}:`, err);
        return res.status(500).json({ error: 'Internal server error during expense payment update.' });
    }
};
