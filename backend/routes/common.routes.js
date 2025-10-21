import express from 'express';
import { viewData, getExpenses, joinMeeting, createGoogleMeet, fetchTourPlanDatesByExId } from '../controllers/common.controllers.js';
// import { checkUser } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/view-data', viewData);
router.post('/get-expenses', getExpenses);
router.get('/join-meeting', joinMeeting);
router.post('/create-meeting', createGoogleMeet);
router.post('/fetch-tour-plan-dates', fetchTourPlanDatesByExId);

export default router;