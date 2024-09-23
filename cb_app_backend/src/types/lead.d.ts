import { Date, Document, Types } from 'mongoose';

export interface ILeadData extends Document {
  user?: Types.ObjectId;
  name?: string;
  createdAt: Date;
  dataFile?: string;
}

export interface ILeadsDataFile {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ILeadStatus extends Document {
  user?: Types.ObjectId;
  name?: string;
  createdAt: Date;
  sessionId: string;
  intent: string;
}
