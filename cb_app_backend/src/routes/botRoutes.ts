import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import { createBot, getBot, getAllBots, updateBot } from '../controllers/botController';

const router: Router = express.Router();

router.use(protect);

router.route('/:id').get(getBot).patch(updateBot);
router.route('/').post(createBot).get(getAllBots);

export default router;
