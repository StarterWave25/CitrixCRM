import { pool } from '../database/db.js';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

// --- Google OAuth 2.0 Setup ---
const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

console.log(process.env.GOOGLE_CLIENT_ID);

// Set the Refresh Token for persistent access
// NOTE: This token must be obtained once via the OAuth consent flow.
if (process.env.GOOGLE_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
} else {
    console.warn("GOOGLE_REFRESH_TOKEN is not set. Google Meet creation will fail unless a new token is generated.");
}

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

/**
 * Controller function to create a new Google Meet event and record it in the database.
 * Route: POST /api/employee/create-meeting
 * Request Body: { "startTime": "ISO String", "endTime": "ISO String" }
 */
export const createGoogleMeet = async (req, res) => {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Missing startTime or endTime in request body.' });
    }

    try {
        // Step 1: Create the Google Calendar Event (including the Meet Link)
        const event = {
            summary: 'New Employee Meeting',
            description: 'Meeting created by the application for daily catch-up.',
            start: {
                dateTime: startTime,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endTime,
                timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
                createRequest: {
                    requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };
        console.log(event);
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        console.log(response);

        const meetingLink = response.data.hangoutLink ||
            response.data.conferenceData?.entryPoints?.find(p => p.entryPointType === 'video')?.uri;

        if (!meetingLink) {
            return res.status(500).json({ error: 'Failed to generate meeting link from Google API.' });
        }

        // Step 2: Determine the next count for today's meetings
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const countSql = `
            SELECT 
                MAX(count) AS maxCount 
            FROM 
                \`meetings\` 
            WHERE 
                DATE(date) = ?
        `;

        const [countRows] = await pool.execute(countSql, [today]);

        const maxCount = countRows[0].maxCount || 0;
        const newCount = maxCount + 1;

        // Step 3: Insert the new meeting record into the database
        const insertSql = `
            INSERT INTO \`meetings\` (meetingLink, count)
            VALUES (?, ?)
        `;
        const insertValues = [meetingLink, newCount];

        await pool.execute(insertSql, insertValues);


        // Step 4: Return the meeting link to the user
        return res.json({
            success: true,
            message: "Google Meet created and logged successfully.",
            meetingLink: meetingLink,
            dbCount: newCount
        });

    } catch (error) {
        // Check for specific Google API token errors
        if (error.message && error.message.includes('invalid_grant')) {
            console.error('CRITICAL: Invalid Refresh Token.');
            return res.status(500).json({
                error: 'Authorization failure. Please refresh the GOOGLE_REFRESH_TOKEN.',
                details: error.message
            });
        }
        console.error('Google Meet Creation/DB Logging Error:', error.message);
        return res.status(error.code || 500).json({
            error: 'An internal error occurred while creating or logging the meeting.',
            details: error.message
        });
    }
};

/**
 * Controller function to view the data.
 * Expected Request Body: { empId, exId, fromDate, toDate }
 */

export const viewData = async (req, res) => {
    const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

    function isValidDateString(s) {
        return typeof s === 'string' && DATE_RE.test(s);
    }

    function buildDateFilterSingle(fieldName, date) {
        // returns SQL fragment and params
        return { sql: `\`${fieldName}\` = ?`, params: [date] };
    }

    function buildDateFilterRange(fieldName, from, to) {
        return { sql: `\`${fieldName}\` BETWEEN ? AND ?`, params: [from, to] };
    }

    try {
        if (!pool) return res.status(500).json({ error: 'DB pool not configured' });

        const { empId, exId, fromDate, toDate } = req.body || {};

        // Basic validation for empId/exId if provided
        const empIdNum = empId !== undefined && empId !== '' ? Number(empId) : null;
        const exIdNum = exId !== undefined && exId !== '' ? Number(exId) : null;
        if (empId !== undefined && empId !== '' && (!Number.isInteger(empIdNum) || empIdNum <= 0)) {
            return res.status(400).json({ error: 'Invalid empId' });
        }
        if (exId !== undefined && exId !== '' && (!Number.isInteger(exIdNum) || exIdNum <= 0)) {
            return res.status(400).json({ error: 'Invalid exId' });
        }

        const fProvided = fromDate !== undefined && fromDate !== '' && fromDate !== null;
        const tProvided = toDate !== undefined && toDate !== '' && toDate !== null;

        if (!fProvided && !tProvided) {
            return res.status(400).json({ error: 'Provide at least fromDate or toDate (YYYY-MM-DD)' });
        }

        // Validate date strings when provided
        if (fProvided && !isValidDateString(fromDate)) return res.status(400).json({ error: 'Invalid fromDate format' });
        if (tProvided && !isValidDateString(toDate)) return res.status(400).json({ error: 'Invalid toDate format' });

        // Determine date filter strategy per-table (some tables use `Date` capitalized, some `date`)
        // We'll build per-query fragments below
        // For single-date case: use that date as equality; for range: between inclusive

        // Helper to assemble WHERE clauses safely
        const addFilters = (baseFieldName, dateSqlObj) => {
            // baseFieldName is the column name for date (`Date` or `date`)
            const where = [];
            const params = [];

            if (dateSqlObj) {
                where.push(dateSqlObj.sql.replace('`field`', `\`${baseFieldName}\``)); // not used, but keep structure
            }

            // we'll push the actual date clause separately (constructed properly)
            return { where, params };
        };

        // Build date clause generator for a given date column name
        function dateClauseFor(columnName) {
            if (fProvided && tProvided) {
                return buildDateFilterRange(columnName, fromDate, toDate);
            } else if (fProvided) {
                return buildDateFilterSingle(columnName, fromDate);
            } else {
                // only toDate provided
                return buildDateFilterSingle(columnName, toDate);
            }
        }

        // Build common filters (empId, exId)
        const commonWhereClauses = [];
        const commonParams = [];
        if (empIdNum) {
            commonWhereClauses.push('`empId` = ?');
            commonParams.push(empIdNum);
        }
        if (exIdNum) {
            commonWhereClauses.push('`exId` = ?');
            commonParams.push(exIdNum);
        }

        // -- 1) tourplan: columns needed -> Date, Extension Name, Out Station, Joint Work
        const tourDateClause = dateClauseFor('Date'); // tourplan uses `Date` column
        const tourWhere = [];
        const tourParams = [];
        tourWhere.push(tourDateClause.sql.replace('`Date`', '`Date`')); // already correct
        tourParams.push(...tourDateClause.params);
        // add empId/exId filters
        if (commonWhereClauses.length) {
            tourWhere.push(...commonWhereClauses);
            tourParams.push(...commonParams);
        }
        const tourSql = `
      SELECT \`Date\`, \`Extension Name\`, \`Out Station\`, \`Joint Work\`
      FROM \`tourplan\`
      WHERE ${tourWhere.join(' AND ')}
      ORDER BY \`Date\` ASC
    `;

        // -- 2) doctorsList (doctor activities joined with doctors)
        // doctor activities has `date` (lowercase), doctors has `Doctor Name`, `Phone`, `Address`
        const docActDateClause = dateClauseFor('date'); // doctor activities uses `date`
        const docWhere = [];
        const docParams = [];
        docWhere.push(docActDateClause.sql.replace('`date`', '`doctor activities`.`date`'));
        docParams.push(...docActDateClause.params);
        if (commonWhereClauses.length) {
            // empId filter is on doctor activities.empId, exId filter should be on doctor activities.exId? doctor activities table doesn't have exId; doc table has exId
            // We'll apply empId filter to doctor activities and exId filter to doctors table via JOIN condition
            // But to keep things simple: empId filter applied to doctor activities; exId filter applied to doctors.exId
            // Append empId clause (if present)
            if (empIdNum) {
                docWhere.push('`doctor activities`.`empId` = ?');
                docParams.push(empIdNum);
            }
            if (exIdNum) {
                docWhere.push('`doctors`.`exId` = ?');
                docParams.push(exIdNum);
            }
        }
        const doctorsListSql = `
      SELECT
        \`doctor activities\`.\`date\` AS \`Date\`,
        \`doctor activities\`.\`Employee Name\` AS \`Employee Name\`,
        \`doctor activities\`.\`Feedback\` AS \`Feedback\`,
        \`doctor activities\`.\`Order Status\` AS \`Order Status\`,
        \`doctors\`.\`Doctor Name\` AS \`Doctor Name\`,
        \`doctors\`.\`Phone\` AS \`Phone\`,
        \`doctors\`.\`Address\` AS \`Address\`
      FROM \`doctor activities\`
      LEFT JOIN \`doctors\` ON \`doctor activities\`.\`docId\` = \`doctors\`.\`docId\`
      WHERE ${docWhere.join(' AND ')}
      ORDER BY \`doctor activities\`.\`date\` ASC
    `;

        // -- 3) orders: orders JOIN ordered products JOIN products
        // orders uses `Date` column
        const ordersDateClause = dateClauseFor('Date');
        const ordersWhere = [];
        const ordersParams = [];
        ordersWhere.push(ordersDateClause.sql.replace('`Date`', 'o.`Date`')); ordersParams.push(...ordersDateClause.params);
        // empId filter on orders.empId, exId filter on orders.exId
        if (empIdNum) {
            ordersWhere.push('`o`.`empId` = ?');
            ordersParams.push(empIdNum);
        }
        if (exIdNum) {
            ordersWhere.push('`o`.`exId` = ?');
            ordersParams.push(exIdNum);
        }

        const ordersSql = `
      SELECT
        o.\`Date\` AS \`Date\`,
        o.\`Employee Name\` AS \`Employee Name\`,
        o.\`Doctor Name\` AS \`Doctor Name\`,
        o.\`DL Copy\` AS \`DL Copy\`,
        o.\`Prescription\` AS \`Prescription\`,
        op.\`Strips\` AS \`Strips\`,
        op.\`Free Strips\` AS \`Free Strips\`,
        p.\`Product Name\` AS \`Product Name\`
      FROM \`orders\` o
      LEFT JOIN \`ordered products\` op ON op.\`orderId\` = o.\`orderId\`
      LEFT JOIN \`products\` p ON p.\`pId\` = op.\`pId\`
      WHERE ${ordersWhere.join(' AND ')}
      ORDER BY o.\`Date\` ASC
    `;

        // Execute queries in parallel
        const queries = [
            pool.execute(tourSql, tourParams),
            pool.execute(doctorsListSql, docParams),
            pool.execute(ordersSql, ordersParams)
        ];

        const [[tourRows], [docRows], [orderRows]] = await Promise.all(queries);

        // Return response with exact keys required
        return res.json({
            tourplan: tourRows || [],
            doctorsList: docRows || [],
            orders: orderRows || []
        });
    } catch (err) {
        console.error('show-my-data error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/*
 * Controller function to retrieve all expense records for a specific employee.
 * Expected Request Body: { "empId": 2 }
*/

export const getExpenses = async (req, res) => {
    // 1. Extract empId from route parameters and ensure it's a number
    console.log(req.body);
    const empId = parseInt(req.body.empId, 10);

    if (isNaN(empId) || empId <= 0) {
        return res.status(400).json({ error: 'Invalid employee ID format provided.' });
    }

    try {

        // 2. Construct the parameterized SQL query
        // Backticks are used around the table name to handle spaces/keywords
        const sql = `
            SELECT
                expenses.\`Date\`,
                extensions.\`Extension Name\`,
                expenses.\`Normal Expense\`,
                expenses.\`Extension Expense\`,
                expenses.\`Outstation Expense\`,
                expenses.\`Total Expense\`,
                expenses.\`Paid Status\`,
                expenses.\`Travel Bill\`,
                expenses.\`Stay Bill\`
            FROM
                \`expenses\`
            INNER JOIN
                \`extensions\`
            ON
                expenses.exId = extensions.exId
            WHERE
                expenses.empId = ? AND expenses.\`Paid Status\` = ?
        `;
        const values = [empId, 'Not Paid'];

        // 3. Execute the query securely
        const [rows] = await pool.execute(sql, values);

        // 4. Handle no records found
        if (rows.length === 0) {
            return res.status(404).json({ message: `No expense records found for empId: ${empId}` });
        }

        // 5. Return the expense records
        return res.json({ success: true, expenses: rows });

    } catch (err) {
        console.error(`Get Expenses error for empId ${empId}:`, err);
        return res.status(500).json({ error: 'Internal server error while fetching expenses.' });
    }
};

/**
 * Controller function to retrieve the highest-priority meeting link for the current day.
 * It finds the meeting where the 'date' matches today and the 'count' column has the highest value.
 * Route: GET /api/md/join-meeting
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const joinMeeting = async (req, res) => {
    try {
        const tableName = 'meetings';

        // 1. Get today's date in YYYY-MM-DD format for database comparison.
        // Assuming the 'date' column in the meetings table stores only the date part.
        const today = new Date().toISOString().split('T')[0];

        // 2. Construct the SQL query.
        // - Filters meetings for today's date.
        // - Orders by 'count' column in descending order (highest count first).
        // - LIMIT 1 ensures only the single highest-count result is returned.
        // - Selects only the 'meetingLink' column.
        const sql = `
            SELECT 
                \`Meeting Link\` as meetingLink
            FROM 
                \`${tableName}\`
            WHERE 
                DATE(date) = ?
            ORDER BY 
                Count DESC
            LIMIT 1
        `;
        const values = [today];

        const [rows] = await pool.execute(sql, values);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No high-priority meetings found for today.'
            });
        }

        // 3. Return the meeting link (which will be the first and only row)
        return res.json({
            success: true,
            meetingLink: rows[0].meetingLink
        });

    } catch (err) {
        console.error('Join Meeting error:', err);
        return res.status(500).json({ error: 'Internal server error while retrieving meeting link.' });
    }
};