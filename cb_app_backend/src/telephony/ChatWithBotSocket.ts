import { getGptResponse } from '../utils/getGptResponse';
import WebSocket from 'ws';
export const initializeChatWebSocket = (wss: WebSocket.Server) => {
  wss.on('connection', (ws) => {
    console.log('New chat WebSocket client connected');
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('data from chat ws', data);

        // GET MESSAGE FROM CLIENT
        // const conversation = JSON.parse(data);
        const conversation = data;
        // GENERATE RESPONSE
        console.log('conversation=> ', conversation);
        let gptResponse = '';
        // if (conversation.length > 1) {
        try {
          gptResponse = await getGptResponse(conversation);
        } catch (error) {
          gptResponse = JSON.stringify(error);
        }
        // } else gptResponse = 'message was too short';

        // SEND RESPONSE TO CLIENT
        ws.send(JSON.stringify({ payload: gptResponse }));
        // ws.send(JSON.stringify({ type: 'chat', payload: gptResponse }));
      } catch (error) {
        console.error('Error handling message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format or call error' }));
      }
    });
  });
};
