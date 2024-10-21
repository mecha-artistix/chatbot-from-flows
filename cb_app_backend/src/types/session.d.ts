import { Date, Document, Types } from "mongoose";
export interface ISession extends Document {
  user?: Types.ObjectId;
  createdAt: Date;
  lead?: Types.ObjectId;
  intent?: string;
  sid: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  fromFormatted?: string;
  toFormatted?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  price?: number;
  conversation?: string;
}
