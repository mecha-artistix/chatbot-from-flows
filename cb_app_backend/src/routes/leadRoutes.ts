import express, { Router } from 'express';
import {
  createLead,
  getAllLeads,
  deleteLead,
  updateLead,
  getPaginatedLeads,
  leadsStats,
} from '../controllers/leadController';

const router: Router = express.Router();

router.route('/').post(createLead).get(getAllLeads);
router.route('/stats').get(leadsStats);
router.route('/:id').delete(deleteLead).patch(updateLead);

export default router;
