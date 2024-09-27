import mongoose, { Schema, Model } from 'mongoose';
import WebSocket from 'ws';
import validator from 'validator';
import User from './usersModel';
import { ILead, ISession, ILeadDataSource } from '../types/lead';

const sessionSchema = new Schema<ISession>({
  //   user: { type: Schema.ObjectId, ref: 'User', required: true },
  //   name: { type: String, required: false },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  createdAt: { type: Date, default: Date.now },
  sessionId: { type: String },
  intent: { type: String },
});

const leadSchema = new Schema<ILead>({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  name: { type: String, required: false },
  phone: { type: String, match: /^[0-9+\-\s()]*$/ },
  email: {
    type: String,
    required: false,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  createdAt: { type: Date, default: Date.now },
  dataSource: { type: Schema.ObjectId, ref: 'LeadDataSource', required: false },
  sessions: [sessionSchema],
});

const leadsDataSourceSchema = new Schema<ILeadDataSource>({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  name: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  leads: [{ type: Schema.ObjectId, ref: 'Lead', required: false }],
});

/*
- MIDDLEWARE CONTROLLERS

 */

leadSchema.post<ILead>('save', async function (doc) {
  try {
    const source = await LeadDataSource.findOne({ _id: doc.dataSource });
    const update = await LeadDataSource.findOneAndUpdate(
      { _id: doc.dataSource },
      { $addToSet: { leads: doc._id } },
      { new: true, upsert: true },
    );
  } catch (error) {
    console.error(error);
  }
});

/*
- Initialize Call web socket
 */

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

/*
- EXPORTS
*/
export const Session = mongoose.model('Session', sessionSchema);
export const Lead = mongoose.model<ILead>('Lead', leadSchema);
export const LeadDataSource = mongoose.model('LeadDataSource', leadsDataSourceSchema);
