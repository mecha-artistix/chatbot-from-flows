import { catchAsync } from '../utils/catchAsync';
import Bot from '../models/botModel';
import { createOne, getAll, getOne, updateOne } from './handlerFactory';
import AppError from '../utils/appError';

export const getBot = getOne(Bot);

export const createBot = catchAsync(async (req, res, next) => {
  const user = req?.user?._id;
  const { name, promptText, source } = req.body;
  const botData = { name, promptText, source };
  const newBot = await Bot.findOneAndUpdate({ user, name }, { $set: botData }, { new: true, upsert: true });
  if (!newBot) return new AppError('there was an error while saving  bot', 500);
  res.status(201).json({ message: 'bot saved', data: { data: newBot } });
});

export const updateBot = updateOne(Bot);

export const getAllBots = getAll(Bot);
