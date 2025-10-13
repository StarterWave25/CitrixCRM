import express from 'express';
import { viewData, getExpenses, joinMeeting, createGoogleMeet } from '../controllers/common.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/show-my-data', viewData);
router.post('/get-expenses', getExpenses);
router.get('/join-meeting', joinMeeting);
router.post('/create-meeting', createGoogleMeet);

export default router;