import { Date, Document, Types } from 'mongoose';

export interface ILead extends Document {
  user?: Types.ObjectId;
  name?: string;
  createdAt: Date;
  sessionId: string;
  intent: string;
}

interface IIntent {
  sessionId: string;
  intent: string;
}
