// routes/employee.route.js

import express from 'express';
import { submitForm, sendMessage, uploadImage, fetchFormDependencies } from '../controllers/employee.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/forms-submit', submitForm);
router.post('/send-message', sendMessage);
router.post('/upload-image',(req, res, next)=> {console.log('called'); next()}, uploadImage);
router.post('/fetch-form-dependencies', fetchFormDependencies);

export default router;