const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, SERVER_IP } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/*
 twiml: '<Response><Say>Ahoy, World! I am twilio calling you to test connection</Say></Response>',
  twiml: '<Response><Say>Hello, this is a test call.</Say><Dial>' + fromNum + '</Dial></Response>',
  from: '+14803767089',
 */
const toNums = ['+923438203546', '+923439107326', '+923335354297', '+923115752002', '+923185362004'];
const fromNum = '+16155520134';
// const botNum = '+16155520134';
async function createCall(fromNum, toNum) {
  const call = await client.calls.create({
    // twiml: '<Response><Say>Hello, this is a test call.</Say><Dial>' + fromNum + '</Dial></Response>',
    twiml: `<Response><Dial>${fromNum}</Dial></Response>`,
    from: `${TWILIO_PHONE_NUMBER}`,
    // from: fromNum,
    to: toNum,
  });
  console.log(call);
  return call;
}

// createCall(fromNum, toNums[2]);

// Initiate the outbound call
// async function makeCall(toNumber) {
//   const call = await client.calls.create({
//     from: '+YOUR_TWILIO_PHONE_NUMBER', // Twilio number
//     to: toNumber, // callee's phone number
//     url: 'http://91.107.194.217:5180/api/v2/phone/voice-call',
//   });
//   console.log('Call initiated with SID:', call.sid);
// }

async function makeCall(toNumber) {
  const call = await client.calls.create({
    from: `${TWILIO_PHONE_NUMBER}`, // Twilio number
    to: toNumber, // callee's phone number
    url: `${SERVER_IP}/phone/receive-call`, // Your endpoint where Twilio gets TwiML
  });
  console.log('Call initiated', call.sid);
}

// makeCall('+923335354297');
