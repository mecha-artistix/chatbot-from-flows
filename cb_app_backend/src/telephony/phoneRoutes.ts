import express, { Router } from "express";
import { protect } from "../controllers/authController";
import { statusCallback, makeCall, endCall } from "./phoneController";
import { processSpeech } from "./CallWithBotController";

const callRouter: Router = express.Router();

callRouter.route("/process-speech").post(processSpeech);

// TWILIO ROUTES
const phoneRouter: Router = express.Router();
phoneRouter.route("/").post(protect, makeCall);
phoneRouter.route("/abort-call").post(protect, endCall);

callRouter.route("/call-status").post(statusCallback);

// router.use(protect);

export { callRouter, phoneRouter };
