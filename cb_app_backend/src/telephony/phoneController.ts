import { Request, Response } from 'express';
import WebSocket from 'ws';
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { deleteOne, getAll, updateOne } from './../controllers/handlerFactory';
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const fromNum = '+16155520134';
// const botNum = '+16155520134';

const createControlledCall = (fromNum) => {
  const twiml = new VoiceResponse();

  twiml.say('Please wait while we connect your call.');
  twiml.dial(fromNum);

  return twiml.toString();
};

async function createCall(fromNum, toNum) {
  const twimlString = createControlledCall(fromNum);

  const call = await client.calls.create({
    from: TWILIO_PHONE_NUMBER,
    to: toNum,
    twiml: twimlString,
  });

  console.log('Call initiated:', call.sid);
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
              const response = await createCall(fromNum, num);
              console.log('session initiated - ', response.sid);
              ws.send(JSON.stringify({ type: 'callResult', payload: response }));
            }
          } else if ((numbersToCall.length = 1)) {
            const response = await createCall(fromNum, numbersToCall[0]);
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

export async function makeCall(toNumber) {
  const call = await client.calls.create({
    from: TWILIO_PHONE_NUMBER, // Twilio number
    to: toNumber, // callee's phone number
    url: 'http://91.107.194.217:5180/api/v2/phone/receive-call', // Your endpoint where Twilio gets TwiML
  });
  console.log('Call initiated', call.sid);
}

export const reveiveCall = async (req, res) => {
  const twiml = new VoiceResponse();

  // Gather speech input from callee
  twiml.gather({
    input: 'speech',
    action: 'http://91.107.194.217:5180/api/v2/phone/process-speech',
    speechTimeout: 'auto',
  });

  twiml.say('Hello, this is our bot. Please say something, and we will respond.');
  // In case no speech is detected
  twiml.say("We didn't receive any input. Goodbye.");
  // twiml.hangup();

  res.type('text/xml');
  res.send(twiml.toString());
};

export const processSpeech = (req, res) => {
  const userSpeech = req.body.SpeechResult; // SpeechResult contains the recognized text
  console.log('Callee said:', userSpeech);

  // Simulate sending the speech to a bot and getting a response
  const botResponse = getBotResponse(userSpeech); // This is where your bot would come in

  const twiml = new VoiceResponse();
  twiml.say(botResponse); // Twilio TTS reads the bot response to the callee

  res.type('text/xml');
  res.send(twiml.toString());
};

// Simulate a bot response based on the user's speech
function getBotResponse(userSpeech) {
  if (userSpeech.toLowerCase().includes('hello')) {
    return 'Hello! How can I assist you today?';
  } else {
    return 'I am not sure I understand. Could you please repeat that?';
  }
}

/*
  twiml.dial(
    {
      callerId: `${TWILIO_PHONE_NUMBER}`,
    },
    '+923439107326',
  );


  export const makeCall = catchAsync(async (req, res, next) => {
  const { numbersToCall } = req.body;
  const sid = {};
  const calls = await Promise.all(
    numbersToCall.map(async (num) => {
      const call = await createCall(fromNum, num);
      sid[num] = call.sid;
    }),
  );

  res.status(200).json({ message: 'success', data: sid });
});
  

*/
