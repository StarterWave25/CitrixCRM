// middleware/checkUser.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../database/db.js';
dotenv.config();

export const checkUser = async (req, res, next) => {
  try {
    const cookieToken = req.cookies && req.cookies.jwt;
    const authHeader = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const token = cookieToken || authHeader;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided', ok: false });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.warn('JWT verify failed:', err.message);
      return res.status(401).json({ message: 'Unauthorized - Invalid token', ok: false });
    }

    // Ensure role exists in token
    const userRole = (decoded.role || '').toLowerCase();
    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized - role missing in token', ok: false });
    }

    // Map role -> table and id column and name column
    let tableName, idColumn;
    switch (userRole) {
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
        return res.status(400).json({ message: 'Invalid role in token', ok: false });
    }

    // Parameterized query to fetch user by ID
    const sql = `SELECT * FROM \`${tableName}\` WHERE \`${idColumn}\` = ? LIMIT 1`;
    const [rows] = await pool.query(sql, [decoded.userId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found!', ok: false });
    }

    // Remove password field if present
    const user = { ...rows[0] };
    if (user.password) delete user.password;

    // attach role info (useful)
    user.role = userRole;

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in checkUser middleware:', error);
    res.status(500).json({ message: 'Internal Server Error', ok: false });
  }
};
