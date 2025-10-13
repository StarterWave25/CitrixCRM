import Ajv from 'ajv';
import addFormats from 'ajv-formats'; // 1. Import the formats package
import { pool } from '../database/db.js';
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