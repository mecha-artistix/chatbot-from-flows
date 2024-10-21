import express, { Router } from "express";
import {
  createSession,
  getAllSessions,
  deleteSession,
  updateSession,
  sessionsStats,
} from "../controllers/sessionController";
import { protect } from "../controllers/authController";
const router: Router = express.Router();
//  SESSIONS
router.use(protect);
router.route("/").get(getAllSessions).post(createSession).delete(deleteSession);
router.route("/stats").get(sessionsStats);
router.route("/:id").delete(deleteSession).patch(updateSession);

export default router;
