import { Date, Document, Types } from 'mongoose';

export interface ILead extends Document {
  user?: Types.ObjectId;
  name?: string;
  createdAt: Date;
  intent?: IIntent;
}

interface IIntent {
  sessionId: string;
  intent: string;
}
