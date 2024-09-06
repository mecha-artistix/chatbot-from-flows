import Flowchart from '../models/flowchartModel';
import User from '../models/usersModel';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';
import { IFlowChart } from '../types/flowchart';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';

export const updateUser = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You are not logged in', 401));
  }
  req.body.user = req.user._id;
  next();
});

export const createFlowchart = createOne<IFlowChart>(Flowchart);

export const getAllFlowcharts = getAll(Flowchart);

export const getOneFlowchart = getOne(Flowchart);

export const updateFlowchart = updateOne(Flowchart);

export const deleteFlowchart = deleteOne(Flowchart);

export const clearUser = catchAsync(async (req, res, next) => {
  if (!req.deletedDoc) return next(new AppError('Document was not deleted', 500));
  const deletedFlowchart = req.deletedDoc;

  // check/delete related flowchart
  const pullFromUser = { flowcharts: deletedFlowchart._id };
  //   const relatedBot = deletedFlowchart.bot;
  //   if (relatedBot) {
  //     const deletedBot = await Bot.findByIdAndDelete(relatedBot);
  //     pullFromUser.bots = deletedBot._id;
  //   }
  // update user

  if (req.user && req.user._id) await User.updateMany({ _id: req.user._id }, { $pull: pullFromUser });

  res.status(204).json({
    status: 'deleted',
    data: null,
  });
});
