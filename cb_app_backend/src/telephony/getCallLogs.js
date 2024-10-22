const dotenv = require("dotenv");
dotenv.config({ path: "./../../.env" });
const twilio = require("twilio");
const mongoose = require("mongoose");
const { Session } = require("../../dist/models/leadModel");

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, DB_MONGO_URL } = process.env;
console.log(TWILIO_ACCOUNT_SID);

const client = twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN );
mongoose
  .connect(DB_MONGO_URL)
  .then((connection) => console.log("connection successful"));

const sessionLogs = [
  "sid",
  "dateCreated",
  "dateUpdated",
  "toFormatted",
  "from",
  "fromFormatted",
  "status",
  "startTime",
  "endTime",
  "duration",
  "price",
];
const intents = ["XFER", "DAIR", "DNQ", "CallBK", "DNC", "NI", "NP", "A", "Hang_Up", "LB"];
const user = "66c87b11febb7c40e47f974e";
async function listCall() {
  const calls = await client.calls.list();
  const logs = [];

  for (const c of calls) {
    const log = { user };
    sessionLogs.forEach((el) => {
      log[el] = c[el];
      log["intent"] = intents[Math.floor(Math.random() * intents.length)];
    });

    await Session.findOneAndUpdate({ sid: c.sid }, { $set: log }, { new: true, upsert: true });
    console.log("uploaded:", c.sid);
    logs.push(log);
  }

  console.log(logs);
  return logs;
}

async function deleteAllFromDb() {
  // await Session.deleteMany({ user });
}
// deleteAllFromDb();
// async function listCall() {
//   try {
//     // Fetch the list of calls with a limit of 20
//     const calls = await client.calls.list();

//     // Log each Call SID
//     calls.forEach((call) => console.log(call.price));

//     // Return the resolved value (calls)
//     return calls;
//   } catch (error) {
//     console.error('Error fetching call logs:', error);
//     throw error; // Re-throw the error after logging
//   }
// }

async function main() {
  try {
    const calls = await listCall();
    console.log("Retrieved Calls:", calls);
  } catch (error) {
    console.error("Error in main:", error);
  }
  // process.exit();
}

main();
