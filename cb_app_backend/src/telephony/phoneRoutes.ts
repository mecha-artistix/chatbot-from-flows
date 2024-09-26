import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { makeCall, reveiveCall } from './phoneController';

const router: Router = express.Router();

router.route('/').post(makeCall);
router.route('/voice-call').post(reveiveCall);

router.use(protect);
export default router;
