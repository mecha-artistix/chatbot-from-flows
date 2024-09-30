import { Request, Response } from 'express';
import WebSocket from 'ws';
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { deleteOne, getAll, updateOne } from './../controllers/handlerFactory';
import axios, { AxiosResponse } from 'axios';
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const fromNum = '+16155520134';
// const botNum = '+16155520134';

export async function makeCall(toNumber) {
  const call = await client.calls.create({
    from: `${TWILIO_PHONE_NUMBER}`,
    to: toNumber,
    url: 'http://91.107.194.217:5180/api/v2/phone/receive-call',
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
            // Sequential calls with 2-second delay
            for (const num of numbersToCall) {
              const response = await makeCall(num);
              console.log('session initiated - ', response.sid);
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

//

//

//

//
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

export const processSpeech = async (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  const userSpeech = req.body.SpeechResult; // SpeechResult contains the recognized text
  const callSid = req.body.CallSid;
  console.log('Callee said:', userSpeech);

  // Simulate sending the speech to a bot and getting a response
  const botResponse = await getBotResponse(userSpeech, callSid); // This is where your bot would come in

  const twiml = new VoiceResponse();
  twiml.say(botResponse);

  // Gather again to continue the conversation
  twiml.gather({
    input: 'speech',
    action: 'http://91.107.194.217:5180/api/v2/phone/process-speech',
    speechTimeout: 'auto',
  });

  res.type('text/xml');
  res.send(twiml.toString());
};

// Simulate a bot response based on the user's speech
async function getBotResponse(userSpeech, callSid) {
  if (!userSpeech) {
    console.log('userSpeach not caught');
  }
  try {
    const response: AxiosResponse = await axios.post('http://209.209.42.134:5000', {
      session_id: callSid,
      input_text: userSpeech,
    });
    const message = response.data.response;
    return message;
  } catch (error) {
    console.log(error);
    return 'Sorry, there was an error processing your request.';
  }
}

/*
  twiml.dial(
    {
      callerId: `${TWILIO_PHONE_NUMBER}`,
    },
    '+923439107326',
  );

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
