import express, { Router } from 'express';
import { login, protect, signup, logout, verify } from '../controllers/authController';
import { uploadUserPhoto, updateMe } from '../controllers/usersController';

const router: Router = express.Router();
router.post('/signup', signup);

router.post('/login', login);

router.get('/verify', protect, verify);

router.post('/logout', logout);

router.use(protect);

// in single we pass the name of field that is going to hold the file
router.patch('/updateMe', uploadUserPhoto, updateMe);

export default router;
