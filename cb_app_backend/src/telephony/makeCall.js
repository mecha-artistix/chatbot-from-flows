const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const twilio = require('twilio');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function createCall(num) {
  const call = await client.calls.create({
    from: '+14803767089',
    to: num,
    // twiml: '<Response><Say>Ahoy, World! I am twilio calling you to test connection</Say></Response>',
    twiml: '<Response><Dial>+923439107326</Dial></Response>',
  });
  console.log(call);
  return call;
}

const nums = ['+923335354297', '+923115752002'];

createCall(nums[1]);
