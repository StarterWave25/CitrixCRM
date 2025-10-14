// routes/employee.route.js

import express from 'express';
import { submitForm, sendMessage } from '../controllers/employee.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/forms-submit', submitForm);
router.post('/send-message', sendMessage);

export default router;