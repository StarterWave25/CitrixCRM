import Ajv from 'ajv';
import addFormats from 'ajv-formats'; // 1. Import the formats package
import { pool } from '../database/db.js';
import cloudinary from '../lib/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

// Assuming formRegistry is stored as a JSON string in the environment, as you mentioned.
const FORM_REGISTRY = JSON.parse(process.env.FORM_REGISTRY_JSON || '{}');

// Note: Since we're using ES Modules, we have to compile the validators here
// because we can't reliably assume the compilation happened in a global space.
const ajv = new Ajv({ allErrors: true, coerceTypes: true });

// 2. Register formats (like "email") with Ajv
addFormats(ajv);


// Precompile Ajv validators from the environment variable registry
for (const key of Object.keys(FORM_REGISTRY)) {
    try {
        FORM_REGISTRY[key].validator = ajv.compile(FORM_REGISTRY[key].jsonSchema);
    } catch (e) {
        console.error(`Failed to compile schema for ${key}:`, e);
        // Set validator to null or throw an error based on desired behavior
    }
}

/**
 * Controller function to handle generic form submission.
 * Request body: { form: 'employees', data: { ... } }
 */
export const submitForm = async (req, res) => {
    try {
        const { form, data } = req.body;
        if (!form || !data || typeof data !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid request: missing form or data' });
        }

        const entry = FORM_REGISTRY[form];

        if (!entry) return res.status(400).json({ success: false, message: 'Unknown form' });

        // Check for compiled validator
        if (!entry.validator) return res.status(500).json({ success: false, message: 'Form validator not initialized' });

        // 1. Validate with Ajv (server-side source of truth)
        const valid = entry.validator(data);
        if (!valid) {
            return res.status(400).json({ success: false, message: 'Validation failed', data: { details: entry.validator.errors } });
        }

        // 2. Build columns & values from whitelist only
        const toInsert = [];
        const values = [];
        for (const col of entry.columns) {
            // Check for property existence and non-undefined value
            if (Object.prototype.hasOwnProperty.call(data, col.name) && data[col.name] !== undefined) {
                toInsert.push(col.db); // use actual DB column name
                values.push(data[col.name]);
            }
        }

        if (toInsert.length === 0) {
            return res.status(400).json({ success: false, message: 'No insertable fields provided' });
        }

        // 3. Build safe parameterized SQL
        const colsSql = toInsert.map(c => `\`${c}\``).join(', ');
        const placeholders = toInsert.map(() => '?').join(', ');
        const sql = `INSERT INTO \`${entry.table}\` (${colsSql}) VALUES (${placeholders})`;

        // 4. Execute the query
        const [result] = await pool.execute(sql, values);

        return res.json({ success: true, insertId: result.insertId, executedSql: sql });
    } catch (err) {
        console.error('Submit error', err);
        // 1062 is typically a Duplicate Entry error code in MySQL
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Record already exists (Duplicate entry)' });
        }
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// --- Configuration Constants ---
const WHATSAPP_API_URL = 'https://wasenderapi.com/api/send-message';

/**
 * Sends a message based on the recipient type ('stockist' or 'candf').
 * * Front-end request data expected:
 * @param {number} exId - The ID of the extension (used to lookup the stockist's phone).
 * @param {string} to - The target recipient type ('stockist' or 'candf').
 * @param {string} message - The message content to send.
 */
export const sendMessage = async (req, res) => {
    // 1. Initial Data and Config Setup
    const { exId, to, message } = req.body;
    const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
    const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;
    const ADMIN_NAME = process.env.ADMIN_NAME;
    // 2. Input Validation
    if (!WHATSAPP_API_KEY || !ADMIN_PHONE_NUMBER) {
        console.error("Configuration Error: Missing WHATSAPP_API_KEY or ADMIN_PHONE_NUMBER.");
        return res.status(500).json({
            success: false,
            message: "Server configuration incomplete. Cannot send message."
        });
    }

    if (!exId || !to || !message) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: exId, to, and message must be provided."
        });
    }

    let recipientPhone = null, recipientName = null;

    try {
        // 3. Determine Recipient Phone Number
        if (to === 'stockist') {
            // Get phone number from 'stockists' by joining 'extensions' on 'stockId'
            const stockistQuery = `
                SELECT s.Phone, s.\`Stockist Name\`
                FROM extensions AS e
                JOIN stockists AS s ON e.stockId = s.stockId
                WHERE e.exId = ?;
            `;

            const [rows] = await pool.query(stockistQuery, [exId]);

            if (rows.length > 0) {
                recipientName = rows[0]['Stockist Name']
                recipientPhone = rows[0].phone;
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Stockist not found for the provided exId.",
                });
            }

        } else if (to === 'candf') {
            // Get phone number from environment variables
            recipientPhone = ADMIN_PHONE_NUMBER;
            recipientName = ADMIN_NAME;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid 'to' target. Must be 'stockist' or 'candf'."
            });
        }

        // Final check before sending the message
        if (!recipientPhone || !recipientName) {
            return res.status(500).json({
                success: false,
                message: "Could not resolve a valid phone number for the recipient."
            });
        }

        // --- 4. Send WhatsApp Message ---
        const addonMsg = `🚨 URGENT DELIVERY ALERT! 🚨\n\nHey ${recipientName},\n`;
        const wprequest = await fetch(WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': WHATSAPP_API_KEY,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                to: recipientPhone,
                text: addonMsg + message
            })
        });

        // 5. Handle External API Response
        if (!wprequest.ok) {
            // Log the external error details
            const errorBody = await wprequest.text().catch(() => 'No error body available');
            console.error(`WhatsApp API External Failure (Status ${wprequest.status}):`, errorBody);

            return res.status(502).json({
                success: false,
                message: "Failed to send message: External WhatsApp service error."
            });
        }

        // 6. Return the successful response body
        const wpresponse = await wprequest.json();
        return res.status(200).json({ success: true, message: 'Message sent successfully', data: wpresponse });

    } catch (error) {
        // 7. Handle internal exceptions (DB errors, network errors, JSON parsing)
        console.error("Internal Server Error in sendMessage controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected internal error occurred."
        });
    }
};


export const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ success: false, message: "Image is required" });
        const uploadResponse = await cloudinary.uploader.upload(image);
        return res.status(200).json({ message: "Image uploaded successfully", url: uploadResponse.secure_url });
    } catch (error) {
        console.log("Error in upload-image-route:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Fetches dependent data required to pre-fill parts of various forms.
 * * @param {object} req - The request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.formName - Identifier for the form ('tourPlan' or 'doctorslist').
 * @param {number} [req.body.hqId] - Headquarters ID, required for 'tourPlan' form.
 * @param {number} [req.body.exId] - Extension ID, required for 'doctorslist' form.
 * @returns {object} JSON response with the fetched data or an error message.
 */
export const fetchFormDependencies = async (req, res) => {
    // Note: empId is NOT destructured as it is not used in the doctorslist logic now
    const { formName, hqId, exId } = req.body;

    // 1. Initial Input Validation
    if (!formName) {
        return res.status(400).json({ success: false, message: "The 'formName' field is required." });
    }

    try {
        let query;
        let values;
        let dataKey;
        const requiredStatus = 'Active';

        // --- Use Case 1: Tour Plan (Extensions based on HQ) ---
        if (formName.toLowerCase() === 'tourplan') {
            if (!hqId) {
                return res.status(400).json({ success: false, message: "For 'tourPlan', the 'hqId' is required." });
            }

            // Query: Select all extension names associated with the given hqId.
            query = `
                SELECT 
                    \`exId\`, 
                    \`extensionName\` 
                FROM \`extensions\` 
                WHERE \`hqId\` = ?
            `;
            values = [hqId];
            dataKey = 'extensions';

            // --- Use Case 2: Doctor Activities (Doctors based on Extension and NO ACTIVITY TODAY) ---
        } else if (formName.toLowerCase() === 'doctorslist') {
            // Validation: Only exId is required
            if (!exId) {
                return res.status(400).json({ success: false, message: "For 'doctorslist', the 'exId' is required." });
            }

            // Query: Uses LEFT JOIN to exclude doctors who have ANY record in doctor activities today 
            // regardless of the employee who made the record.
            query = `
                SELECT 
                    d.\`docId\`,
                    d.\`Doctor Name\` AS doctorName,
                    d.\`Address\` AS address,
                    d.\`Stage\`,
                    d.\`Phone\` AS phone
                FROM 
                    \`doctors\` d
                LEFT JOIN
                    \`doctor activities\` da
                ON 
                    d.docId = da.docId
                    AND DATE(da.date) = CURDATE() /* Match by Today's Date ONLY */
                WHERE 
                    d.exId = ? 
                    AND d.Status = ?
                    AND da.docId IS NULL         /* CRITICAL: Exclude the doctor if an activity was found today */
            `;
            // Values needed: exId and requiredStatus
            values = [exId, requiredStatus];
            dataKey = 'doctorsList';

        } else {
            // Handle unknown form name
            return res.status(400).json({ success: false, message: `Unknown form name: '${formName}'.` });
        }

        // 3. Execute the Query
        const [results] = await pool.query(query, values);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No ${dataKey} found for the given criteria.`,
                data: {
                    [dataKey]: []
                }
            });
        }

        // 4. Return the results in the new format
        return res.status(200).json({
            success: true,
            message: `${results.length} ${dataKey} successfully fetched.`,
            data: {
                [dataKey]: results
            }
        });

    } catch (error) {
        console.error(`Database Error during pre-fetch for form '${formName}':`, error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during data fetching."
        });
    }
};

/**
 * Updates an existing Tour Plan entry for an employee on a specific date.
 * * @param {object} req - The request object.
 * @param {object} req.body - The request body.
 * @param {number} req.body.empId - The ID of the employee whose plan is being updated.
 * @param {string} req.body.date - The date of the tour plan entry (YYYY-MM-DD format).
 * @param {number} req.body.hqId - The Headquarters ID.
 * @param {string} req.body.extensionName - The full name of the Extension (used to find exId).
 * @param {string} req.body.outStation - The Out Station status/name.
 * @param {string} req.body.jointWork - The Joint Work status/person.
 */

export const editTourPlan = async (req, res) => {
    const { empId, hqId, extensionName, outStation, jointWork } = req.body;
    const date = new Date().toISOString().split('T')[0];
    // 1. Input Validation
    if (!empId || !date || !hqId || !extensionName || outStation === undefined || jointWork === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: empId, date, hqId, extensionName, outStation, and jointWork."
        });
    }

    try {
        let exId;

        // 2. Fetch Extension ID (exId) from Extension Name
        const [extensionRows] = await pool.query(
            "SELECT `exId` FROM `extensions` WHERE `extensionName` = ?",
            [extensionName]
        );

        if (extensionRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Extension Name '${extensionName}' not found.`
            });
        }

        exId = extensionRows[0].exId;

        // 3. Construct and Execute the UPDATE Query
        const updateQuery = `
            UPDATE \`tourplan\`
            SET 
                \`hqId\` = ?, 
                \`exId\` = ?, 
                \`Extension Name\` = ?,
                \`Out Station\` = ?, 
                \`Joint Work\` = ?
            WHERE 
                \`empId\` = ? AND \`Date\` = ?
        `;

        const updateValues = [
            hqId,
            exId,
            extensionName,
            outStation,
            jointWork,
            empId,
            date
        ];

        const [result] = await pool.query(updateQuery, updateValues);

        // 4. Handle Response
        if (result.affectedRows === 0) {
            // Check if the plan for that date/empId doesn't exist
            const [checkRows] = await pool.query(
                "SELECT 1 FROM `tourplan` WHERE `empId` = ? AND `Date` = ?",
                [empId, date]
            );

            if (checkRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Tour plan entry not found for employee ${empId} on date ${date}.`
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Update successful, but the new values were the same as the old values (0 rows affected)."
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Tour plan for employee ${empId} on ${date} updated successfully.`,
            data: {
                empId,
                date,
                updatedFields: { hqId, exId, outStation, jointWork }
            }
        });

    } catch (error) {
        console.error(`Database Error during editTourPlan operation:`, error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during tour plan update."
        });
    }
};

/**
 * Fetches all product details (ID, Name, Price) from the 'products' table.
 * Does not require any input parameters.
 *
 * @param {object} req - The request object (not used for data).
 * @param {object} res - The response object.
 */
export const getProducts = async (req, res) => {
    try {
        // Query to select all relevant fields from the products table
        const query = `
            SELECT 
                pId, 
                \`Product Name\` AS productName,
                Price AS price
            FROM \`products\`
            ORDER BY \`Product Name\` ASC
        `;

        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No products found in the database.",
                data: {
                    products: []
                }
            });
        }

        // Return the results
        return res.status(200).json({
            success: true,
            message: `${results.length} products successfully fetched.`,
            data: {
                products: results
            }
        });

    } catch (error) {
        console.error("Database Error during product fetching:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during product fetching."
        });
    }
};