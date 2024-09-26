const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const twilio = require('twilio');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
/*
 twiml: '<Response><Say>Ahoy, World! I am twilio calling you to test connection</Say></Response>',
  twiml: '<Response><Say>Hello, this is a test call.</Say><Dial>' + fromNum + '</Dial></Response>',
  from: '+14803767089',
 */
const nums = ['+923438203546', '+923335354297', '+923115752002'];
const fromNum = '+923439107326';

async function createCall(fromNum, toNum) {
  const call = await client.calls.create({
    // twiml: '<Response><Say>Hello, this is a test call.</Say><Dial>' + fromNum + '</Dial></Response>',
    twiml: `<Response>
              <Dial>+923335354297</Dial>
            </Response>`,
    from: '+14803767089',
    to: fromNum,
  });
  console.log(call);
  return call;
}

createCall(fromNum, nums[1]);
