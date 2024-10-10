import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { handleStreams, makeCall } from './phoneController';
import { processSpeech } from './CallWithBotController';

const router: Router = express.Router();

router.route('/').post(makeCall);
// router.route('/voice-call').post(reveiveCall);
// router.route('/make-call').post(reveiveCall);
router.route('/process-speech').post(processSpeech);
router.route('/stream-status').post(handleStreams);
// router.use(protect);
export default router;
