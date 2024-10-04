import { Request, Response } from 'express';
import WebSocket from 'ws';
import twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SERVER_IP } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function makeCall(toNumber) {
  console.log('SERVER_IP', SERVER_IP)
  const call = await client.calls.create({
    from: `${TWILIO_PHONE_NUMBER}`,
    to: toNumber,
    url: `${SERVER_IP}/phone/receive-call`,
    // statusCallback: `${SERVER_IP}/phone/call-status`,
  });
  console.log('Call initiated', call.sid);
  return call;
}

export const initializeCallsWebSocket = (wss: WebSocket.Server) => {
  wss.on('connection', (ws) => {
    console.log('New call WebSocket client connected');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('data from ws', data);
        if (data.type === 'makeCall') {
          const { numbersToCall } = data.payload;

          if (numbersToCall.length > 1) {
            for (const num of numbersToCall) {
              const response = await makeCall(num);
              console.log('session initiated - ', response.sid);
              // CREATE SESSION AND ADD TO LEADS.SESSIONS.
              // GET SESSION DATA FROM TWILIO
              // UPDATE SESSION WITH DATA FROM TWILIO
              ws.send(JSON.stringify({ type: 'callResult', payload: response }));
            }
          } else if ((numbersToCall.length = 1)) {
            const response = await makeCall(numbersToCall[numbersToCall.length - 1]);
            console.log('session initiated - ', response.sid);
            ws.send(JSON.stringify({ type: 'callResult', payload: response }));
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format or call error' }));
      }
    });

    ws.on('close', () => {
      console.log('Call client disconnected');
    });
  });
};
