import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { makeCall, processSpeech, reveiveCall } from './phoneController';

const router: Router = express.Router();

router.route('/').post(makeCall);
// router.route('/voice-call').post(reveiveCall);
router.route('/receive-call').post(reveiveCall);
router.route('/process-speech').post(processSpeech);

router.use(protect);
export default router;
