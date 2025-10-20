import { pool } from "../database/db.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from 'bcryptjs';

// NOTE: This assumes 'pool' (for database connection) and 'generateToken' (for JWT)
// are defined and available in this scope.
/* 
Example Request Body for login -boss:
{
    "email": "prudvi@gmail.com",
    "password": "password",
    "role": "boss"
} 

Example Request Body for login -manager:
{
    "email": "prudvi@gmail.com",
    "password": "password",
    "role": "manager"
}

Example Request Body for login -user:
{
    "email": "prudvi@gmail.com",
    "password": "password",
    "role": "user"
}
    
*/

export const login = async (req, res) => {
  try {
    // Standard response format: { success: boolean, message: string, data: object }

    const { email, password, role } = req.body;

    // 1️⃣ Check if email, password, and role exist
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please enter email, password, and role", success: false });
    }

    let tableName;
    let idColumn;
    let nameColumn;
    // Ensure case-insensitivity for role comparison
    const userRole = role.toLowerCase();
    let userDetails = {};

    // 2️⃣ Determine table and column names based on the provided role
    switch (userRole) {
      case 'employee': // Note: Changed 'user' to 'employee' to match your switch case label
        tableName = 'employees';
        idColumn = 'empId';
        nameColumn = 'empName';
        break;
      case 'manager':
        tableName = 'manager';
        idColumn = 'manId';
        nameColumn = 'manName';
        break;
      case 'boss':
        tableName = 'boss';
        idColumn = 'bossId';
        nameColumn = 'bossName';
        break;
      default:
        return res.status(400).json({ message: "Invalid role provided", success: false });
    }

    let query;
    // 3️⃣ Check if user exists in the appropriate MySQL table
    if (userRole === 'employee') {
      query = `SELECT \`${tableName}\`.*, headquarters.hqName FROM \`${tableName}\` JOIN headquarters ON \`${tableName}\`.hqId = headquarters.hqId WHERE email = ?`;
    }
    else {
      query = `SELECT * FROM \`${tableName}\` WHERE email = ?`;

    }
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      // Generic error message for security (prevents user enumeration)
      return res.status(400).json({ message: "Invalid email or password", success: false });
    }

    const user = rows[0];

    // 4️⃣ Verify Password using bcrypt.compare()
    // Compare the plain text password from the request (password) with the hashed password from the DB (user.password)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password", success: false });
    }

    // 5️⃣ Consolidate user details for response and token generation
    userDetails.id = user[idColumn];
    userDetails.name = user[nameColumn];
    userDetails.email = user.email;
    userDetails.role = userRole;

    // Add headquarter ID only if it exists (relevant only for 'employee' table)
    // NOTE: If you use 'user' in the request, change the switch case from 'employee' to 'user'
    if (userRole === 'employee' && user.hqId && user.hqName) {
      userDetails.hqId = user.hqId; // Mapped to hqId for employees
      userDetails.hqName = user.hqName;
    } else {
      userDetails.hqId = null;
    }

    // 6️⃣ Generate JWT + send cookie
    const token = generateToken(userDetails.id, userDetails.email, userDetails.role);

    // 7️⃣ Respond with success and user info (no password)
    res.status(200).json({
      success: true,
      message: `${userRole} login successful`,
      data: userDetails,
      token: token
    });

  } catch (error) {
    console.error("Error in login controller:", error);
    // Send a generic error response
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};