import { Request, Response } from 'express';
import WebSocket from 'ws';
import twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { clients } from './CallWithBotSocket';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SERVER_IP, SERVER_WS } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export  const makeCall = catchAsync(async (req,res,next) => {
    const {numberToCall} =  req.body
    const twiml = new VoiceResponse();

    twiml.gather({
      input: ['speech'],
      action: `${process.env.SERVER_IP}/phone/process-speech`,
      speechTimeout: 'auto',
    });
    
    twiml.say('Hello, this is our bot. Please say something, and we will respond.');
    twiml.say("We didn't receive any input. Goodbye.");
    
    
      const call = await client.calls.create({
        from: `${TWILIO_PHONE_NUMBER}`,
        to: numberToCall,
        twiml: twiml.toString(),
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],  // events that twilio will send to webhook
        statusCallback: `${SERVER_IP}/phone/call-status`, // actual web hook where twilio will send back events
      });
      console.log('Call initiated', call.sid);
      if (!call) return new AppError('Call init failed', 400)

      res.status(200).json({status:'success', callSid:call.sid ,data: call})
 
}) 


 // POST route for stream status updates from twilio
 export const statusCallback = catchAsync(async (req, res, next) => {
  const statusData = req.body;
  const {CallSid} = req.body
  console.log('statusCallback from twilio - ', statusData.CallStatus);

  if (statusData.StreamSid && statusData.StreamStatus) {
    console.log(`Stream ${statusData.StreamSid} is ${statusData.CallStatus}`);
    // Additional logic based on status
  }

  const clientWs = clients.get(req.body.CallSid)
  
  // Send data to the client if connected
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(JSON.stringify({
      type: 'status',
      data: req.body,
    }));
  }

  res.status(200);
});




//

//
/*

    twiml.start().stream({
      name: 'Media Stream',
      // url: `${SERVER_WS}/media-streams`, // WebSocket URL for real-time media streaming
      url: `ws://91.107.194.217:3000/media-streams`, // WebSocket URL for real-time media streaming
      track: 'both_tracks',
      statusCallback: `${SERVER_IP}/phone/stream-status`, // HTTP(S) URL for stream status updates
    });


export const handleStreamStatus = catchAsync(async (req,res,next)=> {
  console.log('from media stream callBack = ', req.body)
  const { CallSid }= req.body
    const clientWs = clients.get(req.body.CallSid)
  
  // Send data to the client if connected
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(JSON.stringify({
      type: 'stream',
      data: req.body,
    }));
  }

  res.status(200)
})


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



*/
