import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import getLocalIPAddress from './utils/getLocalIPAdress';

import app from './app';

const localIPAddress = getLocalIPAddress();
const host = localIPAddress === '172.31.149.141' ? 'localhost' : localIPAddress;

const { PORT } = process.env;
const mongoUrl = process.env.DB_MONGO_URL?.replace('<db_password>', 'immfAdeLhAHHB0DW');
if (!mongoUrl) {
  throw new Error('MongoDB connection string is undefined');
}

mongoose
  .connect(mongoUrl, { tls: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to mongoDB: ', err));

app.listen(PORT, () => {
  console.log(`Server running on port http://${host}:${PORT}`);
});
