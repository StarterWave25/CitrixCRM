// middleware/checkUser.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/db.js';
dotenv.config();

/**
 * Middleware to authenticate the user via JWT and authorize them
 * based on the role required by the accessed URL.
 * * Assumes req.body.url is sent from the frontend.
 */
export const checkUser = async (req, res, next) => {
    try {
        const cookieToken = req.cookies && req.cookies.jwt;
        const authHeader = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const token = cookieToken || authHeader;

        // Ensure token exists (Authentication step 1)
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided', success: false, authorized: false });
        }

        // Ensure URL is provided for authorization
        const pageUrl = req.body.url;
        if (!pageUrl) {
            return res.status(400).json({ message: 'Missing URL for authorization check', success: false });
        }

        let decoded;
        try {
            // Verify JWT (Authentication step 2)
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.warn('JWT verify failed:', err.message);
            return res.status(401).json({ message: 'Unauthorized - Invalid token', success: false, authorized: false });
        }

        // Ensure role exists in token
        const userRoleInToken = (decoded.role || '').toLowerCase();
        if (!userRoleInToken) {
            return res.status(401).json({ message: 'Unauthorized - role missing in token', success: false, authorized: false });
        }

        // ------------------------------------------------------------
        // 4️⃣ Authorization: Match Token Role to URL Role
        // ------------------------------------------------------------

        // Define role mapping based on URL segment (e.g., /md/ -> boss)
        let requiredRoleInUrl = null;

        // Use URL segments to determine the required role for this page
        if (pageUrl.includes('/md/')) {
            // MD is often referred to as 'boss' in your schema
            requiredRoleInUrl = 'boss';
        } else if (pageUrl.includes('/employee/')) {
            requiredRoleInUrl = 'employee';
        } else if (pageUrl.includes('/manager/')) {
            requiredRoleInUrl = 'manager';
        }

        if (!requiredRoleInUrl) {
            // If the URL structure doesn't match a known role, it's either a public page or an error.
            // For security, if the page is private/protected, default to denying access.
            return res.status(403).json({ message: 'Forbidden - Page role not recognized.', success: false });
        }

        // Final Authorization Check
        if (requiredRoleInUrl !== userRoleInToken) {
            return res.status(403).json({
                message: `Forbidden - Role '${userRoleInToken}' cannot access ${requiredRoleInUrl} page.`,
                success: false
            });
        }

        // Passed authorization, continue with existing database validation
        // ------------------------------------------------------------


        // Map role -> table and id column and name column
        let tableName, idColumn;
        switch (userRoleInToken) { // Use the validated role from the token
            case 'employee':
                tableName = 'employees';
                idColumn = 'empId';
                break;
            case 'manager':
                tableName = 'manager';
                idColumn = 'manId';
                break;
            case 'boss':
                tableName = 'boss';
                idColumn = 'bossId';
                break;
            default:
                return res.status(400).json({ message: 'Invalid role in token', success: false });
        }

        // Parameterized query to fetch user by ID
        const sql = `SELECT * FROM \`${tableName}\` WHERE \`${idColumn}\` = ? LIMIT 1`;
        const [rows] = await pool.query(sql, [decoded.userId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'User not found!', success: false });
        }

        // Remove password field if present
        const user = { ...rows[0] };
        if (user.password) delete user.password;

        // attach role info (useful)
        user.role = userRoleInToken;

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in checkUser middleware:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};