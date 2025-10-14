import { pool } from "../database/db.js";
import { generateToken } from "../lib/utils.js";

// NOTE: This assumes 'pool' (for database connection) and 'generateToken' (for JWT)
// are defined and available in this scope.

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1️⃣ Check if email, password, and role exist
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please enter email, password, and role", ok: false });
    }

    let tableName;
    let idColumn;
    let nameColumn;
    let userRole = role.toLowerCase();
    let userDetails = {};

    // 2️⃣ Determine table and column names based on the provided role
    switch (userRole) {
      case 'user':
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
        return res.status(400).json({ message: "Invalid role provided", ok: false });
    }

    // 3️⃣ Check if user exists in the appropriate MySQL table
    // Note: We select the password for comparison, but will exclude it from the final response.
    const query = `SELECT * FROM ${tableName} WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      // Use a generic error message for security (prevents user enumeration)
      return res.status(400).json({ message: "Invalid email or password", ok: false });
    }

    const user = rows[0];

    // 4️⃣ Verify Password (!!! IMPORTANT: Implement password hashing (e.g., bcrypt) in a real application !!!)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password", ok: false });
    }

    // 5️⃣ Consolidate user details for response and token generation
    userDetails.id = user[idColumn];         // Mapped to empId, manId, or bossId
    userDetails.name = user[nameColumn];     // Mapped to empName, manName, or bossName
    userDetails.email = user.email;
    userDetails.role = userRole;

    // Add headquarter_id only if it exists (relevant only for 'user' / employees table)
    if (userRole === 'user' && user.hqId) {
        userDetails.headquarter_id = user.hqId; // Mapped to hqId for employees
    } else {
        userDetails.headquarter_id = null;
    }


    // 6️⃣ Generate JWT + send cookie
    // Assuming generateToken uses userDetails.id and userDetails.email
    generateToken(userDetails.id, userDetails.email, res);

    // 7️⃣ Respond with success and user info (no password)
    res.status(200).json({
      ok: true,
      message: `${userRole} login successful`,
      user: userDetails,
    });

  } catch (error) {
    console.log("Error in login controller:", error);
    // Send a generic error response
    res.status(500).json({ message: "Internal Server Error", ok: false });
  }
};


export const logout = (req, res) => {
  res.cookie("jwt", "", {maxAge: 0});
  res.status(200).json({message: "Logged out successfully!"});
}