import express from 'express';
import { payExpenses, addEntities } from '../controllers/md.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();
router.post("/pay-expenses", payExpenses);
router.post("/add-entities", addEntities)

export default router;