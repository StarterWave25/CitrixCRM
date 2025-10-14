import jwt from "jsonwebtoken";
import { pool } from '../database/db.js';

export const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided", ok: false });

    // 🔍 Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token", ok: false });

    // 🧠 Fetch user from MySQL using the decoded userId
    const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [
      decoded.userId,
    ]);

    if (rows.length === 0)
      return res
        .status(404)
        .json({ message: "User not found!", ok: false });

    // ✅ Attach user to request (without password)
    req.user = rows[0];

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error", ok: false });
  }
};