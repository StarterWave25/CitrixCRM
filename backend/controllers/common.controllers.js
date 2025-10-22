import dotenv from 'dotenv';
import { google } from 'googleapis';
import { pool } from '../database/db.js'; // Adjust path to your DB pool (mysql2/promise expected)
import { encryptMetadata } from '../lib/encrypt.js';

dotenv.config();

// Required ENV variables
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALENDAR_ID // The email/ID of the calendar where the meeting is created
} = process.env;

// --- INITIAL AUTH CHECK ---
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
  console.error('Missing one of GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN in .env. Meeting creation will fail.');
}

// Scope used for full calendar access including conference creation
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * Returns a pre-configured OAuth2 client with refresh token attached.
 * Google libraries will auto-refresh access tokens as needed.
 */
function createOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  // Attach the saved refresh token so googleapis can request new access tokens automatically.
  // This is where the 'invalid_grant' error occurs if the token is revoked or expired.
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
  });

  return oauth2Client;
}

/**
 * Helper: ensures we can fetch an access token (will cause immediate refresh if necessary).
 * Returns the resolved token or throws.
 */
async function ensureAccessToken(oauth2Client) {
  // getAccessToken returns a Promise resolving to { token } or to a string. We handle both.
  const tokenResponse = await oauth2Client.getAccessToken();
  const token = tokenResponse?.token ?? tokenResponse;
  if (!token) {
    throw new Error('Failed to obtain access token from Google OAuth client.');
  }
  return token;
}

/**
 * Express controller: create Google Meet event, add participants, and log to DB.
 * Route: POST /api/employee/create-meeting
 * Body JSON: { startTime: ISOString, endTime: ISOString, summary?, description?, participants: ["email1@example.com", "email2@example.com"] }
 */
export async function createGoogleMeet(req, res) {
  // Basic input extraction
  const {
    startTime,
    endTime,
    summary = 'New Employee Meeting',
    description = 'Meeting created by the application.',
    participants // Expects an array of email strings
  } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'Missing startTime or endTime in request body.' });
  }

  // --- SECURE VALIDATION BLOCK ---
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  const minDurationMs = 5 * 60 * 1000; // 5 minutes
  const maxDurationMs = 4 * 60 * 60 * 1000; // 4 hours

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date/time format. Use ISO 8601 strings (e.g., 2025-10-13T14:00:00+05:30).' });
  }
  if (start.getTime() <= now.getTime() + 60000) {
    return res.status(400).json({ error: 'Meeting start time must be in the future (allowing a 60s buffer).' });
  }
  if (end.getTime() <= start.getTime()) {
    return res.status(400).json({ error: 'Meeting end time must be after the start time.' });
  }
  const durationMs = end.getTime() - start.getTime();
  if (durationMs < minDurationMs || durationMs > maxDurationMs) {
    const minMin = minDurationMs / 60000;
    const maxHr = maxDurationMs / 3600000;
    return res.status(400).json({ error: `Meeting duration must be between ${minMin} minutes and ${maxHr} hours.` });
  }

  // --- ATTENDEES CONSTRUCTION ---
  const calendarOwnerEmail = GOOGLE_CALENDAR_ID || 'primary';
  let attendees = [];

  // Map input participants to the Google API attendees format
  if (Array.isArray(participants)) {
    attendees = participants
      .filter(email => typeof email === 'string' && email.includes('@')) // Basic email sanity check
      .map(email => ({ email, responseStatus: 'needsAction' }));
  }

  // Add the calendar owner/organizer if they are not already in the list
  if (!attendees.some(a => a.email === calendarOwnerEmail)) {
    attendees.push({ email: calendarOwnerEmail, organizer: true, responseStatus: 'accepted' });
  }

  console.log(attendees);


  // Prepare OAuth client and calendar service
  try {
    const oauth2Client = createOAuth2Client();
    // Ensure an access token is available (this triggers refresh if needed)
    await ensureAccessToken(oauth2Client);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Build event with conference creation request
    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      attendees: attendees, // <-- ADDED PARTICIPANTS HERE
      conferenceData: {
        createRequest: {
          // requestId must be unique for retries
          requestId: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        }
      }
    };

    // Step 1: Insert event with conferenceDataVersion: 1 to request Meet link
    const response = await calendar.events.insert({
      calendarId: calendarOwnerEmail,
      resource: event,
      conferenceDataVersion: 1
    });

    // Try to extract meeting link from multiple possible places
    const data = response.data || {};
    const meetingLink =
      data.hangoutLink ||
      data.conferenceData?.entryPoints?.find(p => p.entryPointType === 'video')?.uri || null;

    if (!meetingLink) {
      return res.status(200).json({
        success: false,
        message: 'Event created but no Meet link was generated. Check account Meet settings.',
      });
    }

    // Step 2 & 3: Log to DB - daily incremental count (assumes `meetings` table)
    try {
      const today = new Date().toISOString().split('T')[0];
      const countSql = 'SELECT MAX(count) AS maxCount FROM `meetings` WHERE DATE(date) = ?';
      const [countRows] = await pool.execute(countSql, [today]); // mysql2/promise style
      const newCount = (countRows[0].maxCount || 0) + 1;

      // Inserts the successfully generated meeting link
      const insertSql = 'INSERT INTO `meetings` (\`Meeting Link\`, count) VALUES (?, ?)';
      await pool.execute(insertSql, [meetingLink, newCount]);

      return res.json({
        success: true,
        message: 'Google Meet created and logged successfully.',
        meetingLink,
        dbCount: newCount,
      });
    } catch (dbErr) {
      // DB error - event may have been created though
      console.log('DB logging error:', dbErr?.message || dbErr);
      return res.status(200).json({
        success: true,
        message: 'Google Meet created but failed to log to DB.',
        meetingLink,
        eventId: data.id,
        dbError: dbErr?.message || String(dbErr),
        event: data
      });
    }
  } catch (error) {
    console.error('Google API error:', error?.response?.data || error?.message || error);
    const errMsg = error?.response?.data || error?.message || String(error);

    // Handle the persistent 'invalid_grant' error
    if (errMsg && typeof errMsg === 'string' && errMsg.includes('invalid_grant')) {
      return res.status(401).json({ error: 'CRITICAL: Invalid or expired refresh token. Re-authorize the application.', details: errMsg });
    }

    // Handle Forbidden errors
    if (errMsg?.error === 'insufficientPermissions' || (errMsg && errMsg.toString().includes('Forbidden'))) {
      return res.status(403).json({ error: 'Insufficient permissions. The token owner cannot create meetings on the target calendar.', details: errMsg });
    }

    return res.status(500).json({ error: 'Failed to create Google Meet event', details: errMsg });
  }
}

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
    return { sql: `\`${fieldName}\` = ?`, params: [date] };
  }

  function buildDateFilterRange(fieldName, from, to) {
    return { sql: `\`${fieldName}\` BETWEEN ? AND ?`, params: [from, to] };
  }

  // --- NEW: Data Transformation Helper ---
  /**
   * Transforms a single row of data into the cell metadata format.
   * @param {Object} row - The database row object.
   * @param {string} tableName - The name of the primary table for this row.
   * @param {string} idName - The name of the primary key column in the row.
   * @param {Array<string>} columnsToEncrypt - Array of column names to apply metadata to.
   * @returns {Object} The transformed row with cell metadata.
   */
  const transformDataForCellMetadata = (row, tableName, idName, columnsToEncrypt) => {
    const transformedRow = {};
    const idValue = row[idName];

    for (const key in row) {
      if (key === idName) {
        // Skip the primary key itself, or keep it if needed
        transformedRow[idName] = idValue;
        continue;
      }

      const columnValue = row[key];

      if (columnsToEncrypt.includes(key)) {
        // Encrypt the metadata (table, idName, key)
        const metadata = {
          table: tableName,
          idName: idName,
          idValue: idValue,
          columnName: key,
          columnValue: columnValue // Keep columnValue unencrypted for display
        };
        // The table, idName, and columnName are combined and encrypted for security.
        const encryptedMeta = encryptMetadata(metadata);

        transformedRow[key] = {
          meta: encryptedMeta, // Encrypted metadata string
          value: columnValue   // Original value for display
        };

      } else {
        // Columns like 'Date', 'Employee Name' (non-editable or already safe)
        transformedRow[key] = {
          value: columnValue
        };
      }
    }
    return transformedRow;
  };
  // ----------------------------------------

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

    // --- QUERY CONFIGURATION (Robust and Scalable) ---
    const queryConfigurations = [
      {
        key: 'tourplan',
        tableName: 'tourplan',
        idName: 'tId',
        dateColumn: 'Date',
        columnsToEncrypt: ['Out Station', 'Joint Work'],
        sqlBuilder: (dateClause, commonClauses, commonParams) => {
          const tourWhere = [];
          const tourParams = [];

          tourWhere.push(dateClause.sql.replace('`Date`', '`Date`')); // Already correct
          tourParams.push(...dateClause.params);

          if (commonClauses.length) {
            tourWhere.push(...commonClauses);
            tourParams.push(...commonParams);
          }

          return {
            sql: `
              SELECT \`tId\`, \`Date\`, \`Extension Name\`, \`Out Station\`, \`Joint Work\`
              FROM \`tourplan\`
              WHERE ${tourWhere.join(' AND ')}
              ORDER BY \`Date\` ASC
            `,
            params: tourParams
          };
        }
      },
      {
        key: 'doctorsList',
        tableName: 'doctors', // Primary table for updates (doctors)
        idName: 'docId',
        dateColumn: 'date',
        columnsToEncrypt: ['Feedback', 'Order Status'],
        sqlBuilder: (dateClause, commonClauses, commonParams) => {
          const docWhere = [];
          const docParams = [];

          docWhere.push(dateClause.sql.replace('`date`', '`doctor activities`.`date`'));
          docParams.push(...dateClause.params);

          // Separate empId and exId filters for this join structure
          if (empIdNum) {
            docWhere.push('`doctor activities`.`empId` = ?');
            docParams.push(empIdNum);
          }
          if (exIdNum) {
            docWhere.push('`doctors`.`exId` = ?');
            docParams.push(exIdNum);
          }

          return {
            sql: `
              SELECT
                \`doctors\`.\`docId\`,
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
            `,
            params: docParams
          };
        }
      },
      {
        key: 'orders',
        tableName: 'orders',
        idName: 'orderId',
        dateColumn: 'Date',
        columnsToEncrypt: ['Strips', 'Free Strips', 'Total'],
        sqlBuilder: (dateClause, commonClauses, commonParams) => {
          const ordersWhere = [];
          const ordersParams = [];

          ordersWhere.push(dateClause.sql.replace('`Date`', 'o.`Date`'));
          ordersParams.push(...dateClause.params);

          if (empIdNum) {
            ordersWhere.push('`o`.`empId` = ?');
            ordersParams.push(empIdNum);
          }
          if (exIdNum) {
            ordersWhere.push('`o`.`exId` = ?');
            ordersParams.push(exIdNum);
          }

          return {
            sql: `
              SELECT
                o.\`orderId\`,
                o.\`Date\` AS \`Date\`,
                o.\`Employee Name\` AS \`Employee Name\`,
                o.\`Doctor Name\` AS \`Doctor Name\`,
                o.\`DL Copy\` AS \`DL Copy\`,
                o.\`Prescription\` AS \`Prescription\`,
                p.\`Product Name\` AS \`Product Name\`,
                op.\`Strips\` AS \`Strips\`,
                op.\`Free Strips\` AS \`Free Strips\`,
                o.\`Total\` AS \`Total\`
              FROM \`orders\` o
              LEFT JOIN \`ordered products\` op ON op.\`orderId\` = o.\`orderId\`
              LEFT JOIN \`products\` p ON p.\`pId\` = op.\`pId\`
              WHERE ${ordersWhere.join(' AND ')}
              ORDER BY o.\`Date\` ASC
            `,
            params: ordersParams
          };
        }
      }
    ];

    // Build all SQL queries and parameters
    const queryPromises = [];
    const resultsMap = {};

    for (const config of queryConfigurations) {
      const dateClause = dateClauseFor(config.dateColumn);
      const { sql, params } = config.sqlBuilder(dateClause, commonWhereClauses, commonParams);

      queryPromises.push(
        pool.execute(sql, params).then(([rows]) => ({
          key: config.key,
          rows: rows,
          tableName: config.tableName,
          idName: config.idName,
          columnsToEncrypt: config.columnsToEncrypt
        }))
      );
    }

    // Execute queries in parallel
    const queryResults = await Promise.all(queryPromises);

    // Transform and store results
    for (const result of queryResults) {
      const transformedRows = (result.rows || []).map(row =>
        transformDataForCellMetadata(row, result.tableName, result.idName, result.columnsToEncrypt)
      );
      resultsMap[result.key] = transformedRows;
    }

    // Return response with exact keys required
    return res.status(200).json({ success: true, data: resultsMap });

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
                extensions.\`extensionName\`,
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

/**
 * Fetches unique tour plan dates for a specific extension (exId)
 * within the last 365 days (from today to one year ago).
 *
 * @param {object} req - The request object.
 * @param {object} req.body - The request body.
 * @param {number} req.body.exId - The Extension ID to filter by.
 */
export const fetchTourPlanDatesByExId = async (req, res) => {
  const { exId } = req.body;

  // 1. Input Validation
  if (!exId) {
    return res.status(400).json({ success: false, message: "The 'exId' field is required." });
  }

  try {
    // 2. SQL Query Construction
    // Selects distinct dates, filtered by exId and falling within the last 365 days.
    const query = `
            SELECT DISTINCT
                -- Format the date explicitly for clean array output
                DATE_FORMAT(\`Date\`, '%Y-%m-%d') AS tourDate
            FROM \`tourplan\`
            WHERE 
                \`exId\` = ?
                -- Filter dates: Must be TODAY or older, but no older than 1 year
                AND \`Date\` >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
                AND \`Date\` <= CURDATE()
            ORDER BY \`Date\` ASC
        `;

    const [results] = await pool.query(query, [exId]);

    // 3. Format Output
    // Map the array of objects (e.g., [{ tourDate: '2025-10-21' }]) 
    // to a simple array of strings (e.g., ['2025-10-21', '2025-10-15'])
    const datesArray = results.map(row => row.tourDate);

    // 4. Return Response
    return res.status(200).json({
      success: true,
      message: `${datesArray.length} tour plan dates fetched for extension ${exId}.`,
      data: {
        tourDates: datesArray
      }
    });

  } catch (error) {
    console.error(`Database Error during fetching tour plan dates for exId ${exId}:`, error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during date fetching."
    });
  }
};