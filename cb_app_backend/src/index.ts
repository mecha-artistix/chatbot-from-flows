import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import getLocalIPAddress from './utils/getLocalIPAdress';
import WebSocket from 'ws';
import app from './app';
import { initializeLeadsWebSocket } from './models/leadModel';
// import { initializeCallsWebSocket } from './telephony/phoneController';
import { initializeChatWebSocket } from './telephony/ChatWithBotSocket';
import { initializeCallsWithBotWebSocket } from './telephony/CallWithBotSocket';
import { initializeMediaStreamsWebSocket } from './telephony/MediaStreamsSocket';

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
  const leadsWss = new WebSocket.Server({ noServer: true, path: '/leads' });
  initializeLeadsWebSocket(leadsWss);

  const callsWss = new WebSocket.Server({ noServer: true, path: '/call' });
  // initializeCallsWebSocket(callsWss);
  initializeCallsWithBotWebSocket(callsWss);

  const chatWss = new WebSocket.Server({ noServer: true, path: '/chat' });
  initializeChatWebSocket(chatWss);

  const mediaStreamsWss = new WebSocket.Server({ noServer: true, path: '/media-streams' });
  initializeMediaStreamsWebSocket(mediaStreamsWss);

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    switch (pathname) {
      case '/chat':
        chatWss.handleUpgrade(request, socket, head, (ws) => {
          chatWss.emit('connection', ws, request);
        });
        break;
      case '/call':
        callsWss.handleUpgrade(request, socket, head, (ws) => {
          callsWss.emit('connection', ws, request);
        });
        break;
      case '/leads':
        leadsWss.handleUpgrade(request, socket, head, (ws) => {
          leadsWss.emit('connection', ws, request);
        });
        break;
      case '/media-streams':
        mediaStreamsWss.handleUpgrade(request, socket, head, (ws) => {
          mediaStreamsWss.emit('connection', ws, request);
        });
        break;
      default:
        console.warn(`Unknown WebSocket path: ${pathname}. Connection destroyed.`);
        socket.destroy();
    }
  });
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
