import express from 'express';
import { payExpenses, addEntity, viewEntity, editCell } from '../controllers/md.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();
router.post("/pay-expenses", payExpenses);
router.post("/add-entity", addEntity);
router.post("/view-entity", viewEntity);
router.post("/edit-cell", editCell);

export default router;