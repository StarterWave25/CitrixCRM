import { login } from "../controllers/auth.controllers.js"
import { checkUser } from "../middlewares/auth.middlewares.js"
import express from 'express'
    
const router = express.Router();

router.post("/login", login);
router.post("/check", checkUser, (req, res) => res.status(200).json({ success: true }));

export default router;