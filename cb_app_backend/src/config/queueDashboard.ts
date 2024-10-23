// src/config/queueDashboard.ts
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Queue } from "bullmq";
import { Application } from "express"; // Import Application

// Import all queues
import * as queues from "../queues";

export const setupQueueDashboard = (app: Application): void => {
  // Use Application type
  if (process.env.NODE_ENV === "development") {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");

    // Convert all Queue instances to BullMQAdapter
    const queueAdapters = Object.values(queues)
      .filter((queue): queue is Queue => queue instanceof Queue)
      .map((queue) => new BullMQAdapter(queue));

    createBullBoard({
      queues: queueAdapters,
      serverAdapter,
    });

    // Add authentication
    app.use(
      "/admin/queues",

      serverAdapter.getRouter(),
    );

    console.log("Queue dashboard available at /admin/queues");
  }
};
