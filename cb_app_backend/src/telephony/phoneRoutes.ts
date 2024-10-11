import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { statusCallback, makeCall, endCall } from './phoneController';
import { processSpeech } from './CallWithBotController';

const callRouter: Router = express.Router();

callRouter.route('/process-speech').post(processSpeech);

// TWILIO ROUTES

callRouter.route('/call-status').post(statusCallback);
// callRouter.route('/abort-call').post(endCall);
// router.route('/stream-status').post(handleStreamStatus)
// router.use(protect);

const phoneRouter: Router = express.Router();
phoneRouter.route('/').post(protect, makeCall);
phoneRouter.route('/abort-call').post(protect, endCall);

export { callRouter, phoneRouter };
