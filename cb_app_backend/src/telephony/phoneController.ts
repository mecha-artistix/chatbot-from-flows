import { Request, Response } from 'express';
import WebSocket from 'ws';
const twilio = require('twilio');
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { deleteOne, getAll, updateOne } from './../controllers/handlerFactory';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function createCall(num) {
  const call = await client.calls.create({
    from: '+14803767089',
    to: num,
    twiml: '<Response><Say>Ahoy, World!</Say></Response>',
  });
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
            // Sequential calls with 2-second delay
            for (const num of numbersToCall) {
              const response = await createCall(num);
              console.log('session initiated - ', response.sid);
              ws.send(JSON.stringify({ type: 'callResult', payload: response }));
            }
          } else if ((numbersToCall.length = 1)) {
            const response = await createCall(numbersToCall[0]);
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

export const makeCall = catchAsync(async (req, res, next) => {
  const { numbersToCall } = req.body;
  const sid = {};
  const calls = await Promise.all(
    numbersToCall.map(async (num) => {
      const call = await createCall(num);
      sid[num] = call.sid;
    }),
  );

  res.status(200).json({ message: 'success', data: sid });
});
