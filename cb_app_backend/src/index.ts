import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import getLocalIPAddress from './utils/getLocalIPAdress';
import WebSocket from 'ws';
import app from './app';
import { initializeLeadsWebSocket } from './models/leadModel';
import { initializeCallsWebSocket } from './telephony/phoneController';

const localIPAddress = getLocalIPAddress();
const host = localIPAddress === '172.31.149.141' ? 'localhost' : localIPAddress;

const PORT = Number(process.env.PORT);
const { DB_MONGO_URL } = process.env;

async function connectToDatabase() {
  try {
    if (!DB_MONGO_URL) throw new Error('MongoDB connection string is undefined');

    await mongoose.connect(DB_MONGO_URL, {
      tls: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to mongoDB: ', err);
    throw err;
  }
}

function initializeWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  initializeLeadsWebSocket(wss);
  initializeCallsWebSocket(wss);
}

async function startServer() {
  await connectToDatabase();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port http://${host}:${PORT}`);
  });

  // Initialize WebSocket server
  initializeWebSocketServer(server);
}

// Start the application
startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

/*

mongoose
  .connect(mongoUrl, { tls: true, serverSelectionTimeoutMS: 30000, socketTimeoutMS: 45000 })
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port http://${host}:${PORT}`);
    });

    // Initialize WebSocket server
    const wss = new WebSocket.Server({ server });
    initializeLeadsWebSocket(wss);
  })
  .catch((err) => console.log('Error connecting to mongoDB: ', err));

*/
