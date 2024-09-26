const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sessionLogs = [
  'sid',
  'dateCreated',
  'dateUpdated',
  'toFormatted',
  'from',
  'fromFormatted',
  'status',
  'startTime',
  'endTime',
  'duration',
  'price',
];

// async function listCall() {
//   const calls = await client.calls.list({ limit: 20 });
//   const logs = [];
//   calls.forEach((c) => {
//     const log = {};
//     sessionLogs.forEach((el, i) => {
//       log[el] = c[el];
//     });
//     console.log(c.sid);
//     logs.push(log);
//   });
//   console.log(logs);
//   return logs;
// }

async function listCall() {
  const calls = await client.calls.list({
    status: 'busy',
    to: '+15558675310',
    limit: 20,
  });

  calls.forEach((c) => console.log(c.sid));
}

listCall();
