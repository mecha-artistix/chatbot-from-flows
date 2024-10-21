import express, { Router } from "express";

import { getLeads, createLead, deleteLead, updateLead } from "../controllers/leadController";

import {
  uploadLeadsCollection,
  createLeadsCollection,
  getLeadsCollection,
  getLeadsfromCollection,
} from "../controllers/leadsCollectionController";

import { protect } from "../controllers/authController";

const router: Router = express.Router();

router.use(protect);

router.route("/collections").post(uploadLeadsCollection, createLeadsCollection).get(getLeadsCollection);
router.route("/collections/:id").get(getLeadsfromCollection).delete(deleteLead).patch(updateLead);
router.route("/").post(createLead).get(getLeads);

router.route("/leads").get(getLeads);

export default router;
