import express, { Router } from "express";

import { getLeads, createLead, deleteLead, updateLead } from "../controllers/leadController";

import {
  uploadLeadsCollection,
  createLeadsCollection,
  getLeadsCollection,
  getLeadsfromCollection,
  deleteLeadCollection,
} from "../controllers/leadsCollectionController";

import { protect } from "../controllers/authController";

const router: Router = express.Router();

router.use(protect);

router.route("/collections").post(createLeadsCollection).get(getLeadsCollection);
router.route("/upload").post(uploadLeadsCollection, createLeadsCollection);
router.route("/collections/:id").get(getLeadsfromCollection).delete(deleteLeadCollection);
router.route("/").post(createLead).get(getLeads);

router.route("/leads").get(getLeads);
router.route("/id").delete(deleteLead).patch(updateLead);
export default router;
