import express, { Router } from 'express';
import { createLead, getAllLeads } from '../controllers/leadController';

const router: Router = express.Router();

router.route('/').post(createLead).get(getAllLeads);

export default router;
