import { Queue, ConnectionOptions } from "bullmq";

const connection: ConnectionOptions = {
  host: "redis",
  port: 6379,
};

export const sessionQueue = new Queue("sessionQueue", { connection });
export const emailQueue = new Queue("emailQueue", { connection });
export const smsQueue = new Queue("smsQueue", { connection });
// Add more queues as needed

// queue helper funcitons
export const addSessionToQueue = async (jobData) => {
  console.log("jobData", jobData);
  await sessionQueue.add("createSession", jobData, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};

// Export connection for workers
export { connection };
