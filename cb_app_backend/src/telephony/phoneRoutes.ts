import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { statusCallback, makeCall, endCall } from './phoneController';
import { processSpeech } from './CallWithBotController';

const router: Router = express.Router();

router.route('/').post(makeCall);
router.route('/process-speech').post(processSpeech);
router.route('/call-status').post(statusCallback);
router.route('/abort-call').post(endCall)
// router.route('/stream-status').post(handleStreamStatus)
// router.use(protect);
export default router;
