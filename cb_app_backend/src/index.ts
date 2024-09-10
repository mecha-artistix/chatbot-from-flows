import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import getLocalIPAddress from './utils/getLocalIPAdress';
import WebSocket from 'ws';
import app from './app';
import { initializeLeadsWebSocket } from './models/leadModel';

const localIPAddress = getLocalIPAddress();
const host = localIPAddress === '172.31.149.141' ? 'localhost' : localIPAddress;

const PORT = Number(process.env.PORT);
const mongoUrl = process.env.DB_MONGO_URL;

if (!mongoUrl) {
  throw new Error('MongoDB connection string is undefined');
}

mongoose
  .connect(mongoUrl, { tls: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port http://${host}:${PORT}`);
    });

    // Initialize WebSocket server
    const wss = new WebSocket.Server({ server });
    initializeLeadsWebSocket(wss); // Initialize WebSocket with leads model
  })
  .catch((err) => console.log('Error connecting to mongoDB: ', err));

// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port http://${host}:${PORT}`);
// });

// // Set up WebSocket server on the existing HTTP server
// const wss = new WebSocket.Server({ server });
// // Initialize WebSocket functionality for the leads collection
// initializeLeadsWebSocket(wss);
