import mongoose, { Schema, Model } from "mongoose";
import validator from "validator";
import { ILead, ISession, ILeadCollection } from "../types/lead";
import User from "./usersModel";

const leadSchema = new Schema<ILead>({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  name: { type: String, required: false },
  phone: { type: String, match: /^[0-9+\-\s()]*$/ },
  email: {
    type: String,
    required: false,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  createdAt: { type: Date, default: Date.now },
  leadsCollection: { type: Schema.ObjectId, ref: "LeadsCollection" },
  sessions: [{ type: Schema.ObjectId, ref: "Session" }],
});

const leadsCollectionSchema = new Schema<ILeadCollection>({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  name: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  leads: [{ type: Schema.ObjectId, ref: "Lead", required: false }],
});

/*
- MIDDLEWARE CONTROLLERS
 */

leadSchema.post<ILead>("save", async function (doc) {
  try {
    await LeadsCollection.findOneAndUpdate(
      { _id: doc.leadsCollection },
      { $addToSet: { leads: doc._id } },
      { new: true, upsert: true },
    );
  } catch (error) {
    console.error(error);
  }
});

export const Lead = mongoose.model<ILead>("Lead", leadSchema);

leadsCollectionSchema.post("save", async function (doc) {
  await User.findOneAndUpdate(
    { _id: doc.user },
    { $addToSet: { leadsCollection: doc._id } },
    { new: true, upsert: true },
  );
});

leadsCollectionSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      await User.updateMany({ _id: doc.user }, { $pull: { leadsCollection: doc._id } });
      await Lead.deleteMany({ _id: { $in: doc.leads } });
    } catch (error) {
      console.error("Error in post findOneAndDelete middleware:", error);
    }
  }
});

/*
- EXPORTS
*/

export const LeadsCollection = mongoose.model("LeadsCollection", leadsCollectionSchema);

/*
- Initialize Call web socket


export const initializeLeadsWebSocket = (wss: WebSocket.Server) => {
  // Access the leads collection from the existing mongoose connection
  const leadsCollection = mongoose.connection.collection('LeadStatus');

  // Set up MongoDB Change Stream to watch for changes in the leads collection
  const changeStream = leadsCollection.watch();

  // WebSocket connection event
  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    // Send live updates to the client when a change occurs in the leads collection
    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        ws.send(JSON.stringify(change.fullDocument));
      }
    });

    // Handle WebSocket disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
};
*/
