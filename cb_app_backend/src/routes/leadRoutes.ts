import express, { Router } from 'express';
import {
  createSession,
  getAllSessions,
  deleteSession,
  updateSession,
  sessionsStats,
} from '../controllers/sessionController';

import { getLeads, createLead, deleteLead, updateLead } from '../controllers/leadController';

import {
  uploadLeadsDataSource,
  createLeadsDataSource,
  getLeadsDataSource,
  getLeadsfromCollection,
} from '../controllers/leadsDataSourceController';

import { protect } from '../controllers/authController';

const router: Router = express.Router();

//  SESSIONS

router.route('/sessions').get(getAllSessions).post(createSession).delete(deleteSession);
router.route('/sessions/stats').get(sessionsStats);
router.route('/sessions/:id').delete(deleteSession).patch(updateSession);

// LEADS Data Source
router.use(protect);
router.route('/collections').post(uploadLeadsDataSource, createLeadsDataSource).get(getLeadsDataSource);
router.route('/collections/:id').get(getLeadsfromCollection).delete(deleteLead).patch(updateLead);
router.route('/').post(createLead).get(getLeads);

export default router;
