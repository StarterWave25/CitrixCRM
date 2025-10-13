import express from 'express';
import { payExpenses } from '../controllers/md.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();
router.post("/pay-expenses", payExpenses);

export default router;