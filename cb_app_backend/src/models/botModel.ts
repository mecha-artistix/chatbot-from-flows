import mongoose, { Schema } from 'mongoose';
import User from './usersModel';
import { IBot } from '../types/bot';

const botSchema = new Schema<IBot>({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  modal: { type: String, default: 'llama3' },
  identity: { type: String, default: '' },
  instrunctions: { type: String, default: '' },
  endPoint: { type: String, default: '' },
  prompt: {
    promptText: { type: String },
    source: { type: Schema.Types.ObjectId, ref: 'Flowchart', default: null },
  },
});

// POST MIDDLEWARE
botSchema.post<IBot>('save', async function (doc) {
  try {
    await User.findOneAndUpdate({ _id: doc.user }, { $addToSet: { bots: doc._id } }, { new: true, upsert: true });
  } catch (error) {
    console.log(error);
  }
});

const Bot = mongoose.model('Bot', botSchema);

export default Bot;
