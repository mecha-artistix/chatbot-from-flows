import WebSocket from "ws";
import twilio from "twilio";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { clients } from "./CallWithBotSocket";
import { Lead } from "../models/leadModel";
import { addSessionToQueue } from "../utils/queue";
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SERVER_IP, SERVER_WS } = process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const makeCall = catchAsync(async (req, res, next) => {
  const user = req?.user?._id;
  const { numberToCall } = req.body;

  const lead = await Lead.findOne({ phone: numberToCall });
  if (!lead) {
    return next(new AppError("Lead not found with the provided phone number", 404));
  }

  const twiml = new VoiceResponse();

  twiml.gather({
    input: ["speech"],
    action: `${SERVER_IP}/call/process-speech`,
    speechTimeout: "auto",
  });

  twiml.say("Hello, this is our bot. Please say something, and we will respond.");
  twiml.say("We didn't receive any input. Goodbye.");

  const call = await client.calls.create({
    from: `${TWILIO_PHONE_NUMBER}`,
    to: numberToCall,
    twiml: twiml.toString(),
    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"], // events that twilio will send to webhook
    statusCallback: `${SERVER_IP}/call/call-status`, // actual web hook where twilio will send back events
  });
  console.log("Call initiated", call.sid);
  if (!call) return next(new AppError("Call init failed", 400));
  /* TO DO -  
  - CREATE A SESSIONS
  - ADD SESSION TO LEADS SESSIONS ARR
  */

  // Add session creation task to the queue
  await addSessionToQueue({
    user,
    sid: call.sid,
    numberToCall,
    leadId: lead._id, // We now use the lead's _id found from the phone number
  });

  res.status(200).json({ status: "success", callSid: call.sid, data: call });
});

// POST route for Ending Twilio Call
export const endCall = catchAsync(async (req, res, next) => {
  const { callSid } = req.body;

  if (!callSid) {
    return next(new AppError("callSid not found in request body", 400));
  }

  try {
    const call = await client.calls(callSid).update({ status: "completed" });

    res.status(200).json({ message: "Call aborted successfully", data: call });
  } catch (error: any) {
    if (error.code === 20404) {
      return next(new AppError("Call not found with the provided callSid", 404));
    } else {
      console.error("Error aborting call:", error);
      return next(new AppError("An error occurred while aborting the call", 500));
    }
  }
});

// POST route for call status updates from twilio
export const statusCallback = catchAsync(async (req, res, next) => {
  const statusData = req.body;
  console.log("statusCallback from twilio - ", statusData.CallStatus);

  if (statusData.StreamSid && statusData.StreamStatus) {
    console.log(`Stream ${statusData.StreamSid} is ${statusData.CallStatus}`);
    // Additional logic based on status
  }

  const clientWs = clients.get(req.body.CallSid);

  // Send data to the client if connected
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(
      JSON.stringify({
        type: "status",
        data: req.body,
      }),
    );
  }
  res.status(200);
});
