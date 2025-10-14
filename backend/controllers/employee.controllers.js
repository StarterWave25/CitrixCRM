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
    console.log('submitForm handler called')
    try {
        const { form, data } = req.body;
        if (!form || !data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Invalid request: missing form or data' });
        }

        const entry = FORM_REGISTRY[form];
        if (!entry) return res.status(400).json({ error: 'Unknown form' });

        // Check for compiled validator
        if (!entry.validator) return res.status(500).json({ error: 'Form validator not initialized' });

        // 1. Validate with Ajv (server-side source of truth)
        const valid = entry.validator(data);
        if (!valid) {
            return res.status(400).json({ error: 'Validation failed', details: entry.validator.errors });
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
            return res.status(400).json({ error: 'No insertable fields provided' });
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
            return res.status(409).json({ error: 'Record already exists (Duplicate entry)' });
        }
        return res.status(500).json({ error: 'Internal server error' });
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
        return res.status(200).json(wpresponse);

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
    console.log('uploadImage handler called')
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ message: "Image is required" });
        const uploadResponse = await cloudinary.uploader.upload(image);
        return res.status(200).json({ message: "Image uploaded successfully", url: uploadResponse.secure_url });
    } catch (error) {
        console.log("Error in upload-image-route:", error);
        res.status(500).json({ message: "Internal Server Error", ok: false });
    }

};