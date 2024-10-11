import WebSocket from 'ws';
import twilio from 'twilio';
import { clients } from './CallWithBotSocket';
import { getGptResponse, Message } from '../utils/getGptResponse';

const { SERVER_IP } = process.env;

// const { VoiceResponse } = require('twilio').twiml;
const { VoiceResponse } = twilio.twiml;

let conversation: Message[] = [];

export const processSpeech = async (req, res) => {
  const { SpeechResult, CallSid } = req.body;

  conversation.push({ role: 'user', content: SpeechResult });
  const clientWs = clients.get(CallSid);

  // Send data to the client if connected
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(
      JSON.stringify({
        type: 'transcription',
        data: conversation,
      }),
    );
  }

  const twiml = new VoiceResponse();
  // console.log('Callee said:', userSpeech);

  // const botResponse = await getBotResponse(userSpeech, callSid);
  // make conversation array
  // give convo array to gpt
  const botResponse = await getGptResponse(conversation);
  conversation.push({ role: 'assistant', content: botResponse });
  // Send bot's speech to the client
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(
      JSON.stringify({
        type: 'transcription',
        data: conversation,
      }),
    );
  }

  twiml.say(botResponse);

  // Gather again to continue the conversation
  twiml.gather({
    input: ['speech', 'dtmf'],
    action: `${SERVER_IP}/phone/process-speech`,
    speechTimeout: 'auto',
  });
  console.log(conversation);
  res.type('text/xml');
  res.send(twiml.toString());
};
