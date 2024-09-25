import { Request, Response } from 'express';

import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { deleteOne, getAll, updateOne } from './handlerFactory';
import { Session } from '../models/leadModel';

export const createSession = catchAsync(async (req, res, next) => {
  const data = { sessionId: req.body.sessionId, intent: req.body.intent };
  const doc = await Session.create(data);
  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});

export const getAllSessions = getAll(Session);

export const getPaginatedSessions = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const leads = await Session.find()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalLeads = await Session.countDocuments();
  res.json({
    data: leads,
    total: totalLeads,
    page,
    totalPages: Math.ceil(totalLeads / limit),
  });
});

export const sessionsStats = catchAsync(async (req, res, next) => {
  const totalLeads = await Session.countDocuments();
  const intentsValues = ['XFER', 'DAIR', 'DNQ', 'CallBK', 'DNC', 'NI', 'NP', 'A', 'Hang_Up', 'LB'];

  let statsObj = {};

  await Promise.all(
    intentsValues.map(async (el) => {
      statsObj[el.replace(' ', '_')] = await Session.countDocuments({ intent: el });
    }),
  );

  res.status(200).json({ status: 'success', totalLeads, stats: statsObj });
});

// export const deleteLead = deleteOne(Lead);
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const leadId = req.params.id;
  try {
    const result = await Session.findByIdAndDelete(leadId);
    if (!result) {
      res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSession = updateOne(Session);
