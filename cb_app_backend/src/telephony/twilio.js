const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config({ path: './../../.env' });

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function createCall() {
  const call = await client.calls.create({
    from: '+14803767089',
    to: '+923439107326',
    url: 'http://demo.twilio.com/docs/voice.xml',
  });

  console.log(call.sid);
}

createCall();
