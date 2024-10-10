import WebSocket from 'ws';
export const initializeCallsWithBotWebSocket = (wss: WebSocket.Server) => {
  wss.on('connection', (ws) => {
    console.log('New Call WebSocket client connected');
    ws.on('message', async (message) => {
      console.log(message);
      try {
      } catch (error) {
        ws.send(JSON.stringify({ message: 'Invalid message format or call error' }));
      }
    });
  });
};
