import mongoose, { Schema } from 'mongoose';
import User from './usersModel';
import { ILead } from 'src/types/lead';

const leadSchema = new Schema<ILead>({
  //   user: { type: Schema.ObjectId, ref: 'User', required: true },
  //   name: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  sessionId: { type: String },
  intent: { type: String },
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
