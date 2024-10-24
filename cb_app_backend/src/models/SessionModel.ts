import mongoose, { Schema, Model } from "mongoose";

import { ISession } from "../types/session";

const sessionSchema = new Schema<ISession>({
  user: { type: Schema.ObjectId, ref: "User", required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  intent: String,
  sid: { type: String, unique: true },
  dateCreated: Date,
  dateUpdated: Date,
  fromFormatted: String,
  toFormatted: String,
  status: String,
  startTime: String,
  endTime: String,
  duration: String,
  price: Number,
  conversation: String,
});

export const Session = mongoose.model("Session", sessionSchema);
