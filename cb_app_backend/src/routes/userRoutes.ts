import express, { Router } from 'express';
// import { login } from 'src/controllers/authController';
import { login, protect, signup, logout, verify } from '../controllers/authController';

const router: Router = express.Router();
router.post('/signup', signup);

router.post('/login', login);

router.get('/verify', protect, verify);

router.post('/logout', logout);

export default router;
