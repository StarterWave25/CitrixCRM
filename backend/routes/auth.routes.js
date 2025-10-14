import { login, logout } from "../controllers/auth.controllers.js"
import { checkUser } from "../middlewares/auth.middlewares.js"
import express from 'express'
    
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkUser, (req, res) => res.status(200).json({ success: true }));

export default router;