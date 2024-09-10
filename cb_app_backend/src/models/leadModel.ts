import mongoose, { Schema } from 'mongoose';
import WebSocket from 'ws';
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

// Function to initialize the WebSocket server for leads collection
export const initializeLeadsWebSocket = (wss: WebSocket.Server) => {
  // Access the leads collection from the existing mongoose connection
  const leadsCollection = mongoose.connection.collection('leads');

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

export default Lead;
