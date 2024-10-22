import express, { Router } from "express";
import { protect } from "../controllers/authController";
import {
  createFlowchart,
  deleteFlowchart,
  getAllFlowcharts,
  getOneFlowchart,
  updateFlowchart,
  updateUser,
} from "../controllers/flowchartController";

const router: Router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllFlowcharts as express.RequestHandler)
  .post(updateUser, createFlowchart as express.RequestHandler);

router
  .route("/:id")
  .get(getOneFlowchart as express.RequestHandler)
  .patch(updateFlowchart as express.RequestHandler)
  .delete(deleteFlowchart as express.RequestHandler);

export default router;
