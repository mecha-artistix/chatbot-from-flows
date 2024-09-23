import express, { Router } from 'express';
import {
  createLead,
  getAllLeads,
  deleteLead,
  updateLead,
  leadsStats,
  uploadLeadsData,
  createLeadsData,
  getLeadsData,
} from '../controllers/leadController';

const router: Router = express.Router();

router.route('/data').post(uploadLeadsData, createLeadsData).get(getLeadsData);
router.route('/').post(createLead).get(getAllLeads);
router.route('/stats').get(leadsStats);
router.route('/:id').delete(deleteLead).patch(updateLead);

export default router;
