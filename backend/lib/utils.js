import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, email, role) => {
  // include role so middleware can decide which table to query
  const payload = { userId, email, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};