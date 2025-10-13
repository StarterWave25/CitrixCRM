import dotenv from 'dotenv';
import { pool } from '../database/db.js';

dotenv.config();

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
