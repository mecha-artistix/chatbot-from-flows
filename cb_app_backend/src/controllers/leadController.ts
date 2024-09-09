import Lead from '../models/leadModel';
import { catchAsync } from '../utils/catchAsync';

export const createLead = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const data = { sessionId: req.body.sessionId, intent: req.body.intent };
  const doc = await Lead.create(data);
  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});

export const getAllLeads = catchAsync(async (req, res, next) => {
  const doc = await Lead.find({});
  res.status(200).json({
    status: 'success',
    data: { data: doc },
  });
});
