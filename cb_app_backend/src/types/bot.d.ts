import { Date, Document, Types } from 'mongoose';

export interface IBot extends Document {
  user: Types.ObjectId;
  name: string;
  createdAt: Date;
  modal: string;
  identity?: string;
  instrunctions: string;
  endPoint: string;
  promptText: string;
  source?: Types.ObjectId;
}

// interface IPrompt {
//   promptText: string;
//   source?: Types.ObjectId;
// }
