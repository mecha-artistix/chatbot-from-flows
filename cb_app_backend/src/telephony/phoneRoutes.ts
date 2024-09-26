import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { makeCall } from './phoneController';

const router: Router = express.Router();

router.use(protect);
router.route('/').post(makeCall);
export default router;
