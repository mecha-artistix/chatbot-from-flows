import { Request, Response } from 'express';
import WebSocket from 'ws';
import twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { catchAsync } from '../utils/catchAsync';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SERVER_IP, SERVER_WS } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function makeCall(toNumber) {
  const twiml = new VoiceResponse();

  twiml.start().stream({
    name: 'Media Stream',
    url: `${SERVER_WS}/media-streams`, // WebSocket URL for real-time media streaming
    track: 'both_tracks',
    statusCallback: `${SERVER_IP}/phone/stream-status`, // HTTP(S) URL for stream status updates

  });

  twiml.gather({
    input: ['speech'],
    action: `${process.env.SERVER_IP}/phone/process-speech`,
    speechTimeout: 'auto',
  });

  twiml.say('Hello, this is our bot. Please say something, and we will respond.');
  twiml.say("We didn't receive any input. Goodbye.");

  try {
    const call = await client.calls.create({
      from: `${TWILIO_PHONE_NUMBER}`,
      to: toNumber,
      twiml: twiml.toString(),
      statusCallbackEvent: ['initiated', 'ringing', 'in-progress', 'completed'], // events that twilio will send to webhook
      statusCallback: `${SERVER_IP}/phone/call-status`, // actual web hook where twilio will send back events
    });
    console.log('Call initiated', call.sid);
    return call;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
}
// POST route for stream status updates from twilio
export const handleStreams = catchAsync(async (req, res, next) => {
  const statusData = req.body;
  console.log('statusData from twilio - ', statusData);

  if (statusData.StreamSid && statusData.StreamStatus) {
    console.log(`Stream ${statusData.StreamSid} is ${statusData.StreamStatus}`);
    // Additional logic based on status
  }

  res.sendStatus(200);
});

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

/*

*/
