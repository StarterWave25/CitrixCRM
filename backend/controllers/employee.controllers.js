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

/**
 * Controller function to send whatsapp message to a number.
 * Request body: { phone:'', message:'' }
 */

// It's best practice to import the API key from a secure config or env setup
const WHATSAPP_API_URL = 'https://wasenderapi.com/api/send-message';

export const sendMessage = async (req, res) => {
    // 1. Destructure required data from the request body
    // The original code used req.phone and req.message, but typically this data comes from req.body
    const { phone, message } = req.body;

    const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;

    // 2. Initial input and configuration validation
    if (!WHATSAPP_API_KEY) {
        console.error("WHATSAPP_API_KEY is not defined in environment variables.");
        // Use 500 status for configuration error
        return res.status(500).json({
            success: false,
            message: "Server configuration error: WhatsApp API key missing."
        });
    }

    if (!phone || !message) {
        // Use 400 status for bad user input
        return res.status(400).json({
            success: false,
            message: "Missing required fields: 'phone' and 'message' must be provided."
        });
    }

    let wprequest;
    let wpresponse;

    try {
        // 3. Construct and execute the external API request with necessary headers
        wprequest = await fetch(WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                // Ensure proper authorization header format (often 'Bearer YOUR_KEY')
                // Assuming wasenderapi uses the key directly as the value:
                'Authorization': WHATSAPP_API_KEY,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                to: phone, // Use destructured variable 'phone' from req.body
                text: message // Use destructured variable 'message' from req.body
            })
        });

        // 4. Handle non-200 HTTP response status from the external API
        if (!wprequest.ok) {
            // Attempt to parse the error response body if available
            const errorBody = await wprequest.json().catch(() => ({}));
            const errorMessage = errorBody.message || `External API responded with status ${wprequest.status}.`;

            // Log the external error for server-side debugging
            console.error(`WhatsApp API Error (Status ${wprequest.status}):`, errorMessage, errorBody);

            // Respond to the client with a generic failure message to avoid exposing internal errors
            return res.status(502).json({
                success: false,
                message: "Failed to send message: External service returned an error."
            });
        }

        // 5. Parse the successful JSON response
        wpresponse = await wprequest.json();

        // 6. Return the external API's response to the client
        // Use 200/202 status for success
        return res.status(200).json(wpresponse);

    } catch (error) {
        // 7. Catch network, DNS, or JSON parsing errors
        console.error("Network or internal error during WhatsApp API call:", error);

        // Respond to the client with a generic server error
        return res.status(500).json({
            success: false,
            message: "Internal server error during message sending process."
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