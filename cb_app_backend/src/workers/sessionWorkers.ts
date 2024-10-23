import { Worker } from "bullmq";
import { connection } from "../queues";
import { Session } from "../models/SessionModel";
import { Lead } from "../models/leadModel";

const sessionWorker = new Worker(
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
      await Lead.findByIdAndUpdate(leadId, {
        $push: { sessions: newSession._id },
      });
    } catch (error) {
      console.error("Error processing session:", error);
      throw error; // Rethrow to mark job as failed
    }
  },
  { connection },
);

export default sessionWorker;
