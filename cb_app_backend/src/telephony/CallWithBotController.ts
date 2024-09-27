const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initiate the outbound call
async function makeCall(toNumber) {
  const call = await client.calls.create({
    from: TWILIO_PHONE_NUMBER, // Twilio number
    to: toNumber, // callee's phone number
    url: 'http://91.107.194.217:5180/api/v2/phone/voice-call',
  });
  console.log('Call initiated with SID:', call.sid);
}
