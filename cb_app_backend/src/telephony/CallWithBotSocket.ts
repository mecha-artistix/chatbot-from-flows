import WebSocket from 'ws';

export const clients = new Map();

export const initializeCallsWithBotWebSocket = (wss: WebSocket.Server) => {
  wss.on('connection', (ws, req) => {
    console.log('New Call WebSocket client connected');

    let callSid: string | null = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'register' && data.callSid) {
          callSid = data.callSid;
          // Store the client connection with the CallSid
          clients.set(callSid, ws);
          console.log(`Client registered with CallSid: ${callSid}`);
        } else {
          console.error('Invalid message format or missing callSid');
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid registration message' }));
        }
      } catch (error) {
        console.error('Error parsing message from client:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error parsing message' }));
      }
    });

    ws.on('close', () => {
      clients.delete(callSid);
      console.log(`Client disconnected with CallSid: ${callSid}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(callSid);
    });
    
  });
};
