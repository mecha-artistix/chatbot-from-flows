import express, { Router } from 'express';
import { createLead, getAllLeads, deleteLead, updateLead, getPaginatedLeads } from '../controllers/leadController';

const router: Router = express.Router();

// router.route('/').post(createLead).get(getAllLeads);
router.route('/').post(createLead).get(getPaginatedLeads);

router.route('/:id').delete(deleteLead).patch(updateLead);

export default router;
