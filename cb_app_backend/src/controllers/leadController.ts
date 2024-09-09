import Lead from '../models/leadModel';
import { catchAsync } from '../utils/catchAsync';

export const createLead = catchAsync(async (req, res, next) => {
  const data = { sessionsId: req.body.session_id, intent: req.body.intent };
  const doc = await Lead.create({ intent: { ...data } });
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
