import { Queue, Worker } from "bullmq";
import { Session } from "../models/SessionModel";
import { Lead } from "../models/leadModel";
const connection = {
  host: "redis", // Docker service name for Redis
  port: 6379, // Redis port as exposed in your Docker Compose file
};

// Queue setup with Redis connection
export const sessionQueue = new Queue("sessionQueue", { connection });

// Function to add a job to the queue
export const addSessionToQueue = async (jobData) => {
  console.log("jobData", jobData);
  await sessionQueue.add("createSession", jobData);
};

// Worker for processing jobs
const worker = new Worker(
  "sessionQueue",
  async (job) => {
    const { user, sid, numberToCall, leadId } = job.data;
    try {
      const newSession = await Session.create({
        user,
        lead: leadId,
        sid,
        fromFormatted: `${process.env.TWILIO_PHONE_NUMBER}`,
        toFormatted: numberToCall,
        status: "initiated",
      });

      // Update the lead's sessions array
      await Lead.findByIdAndUpdate(leadId, { $push: { sessions: newSession._id } });
    } catch (error) {
      console.error("Error processing session:", error);
    }
  },
  { connection },
);
