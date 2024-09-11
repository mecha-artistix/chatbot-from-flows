import { Request, Response } from 'express';
import Lead from '../models/leadModel';
import { catchAsync } from '../utils/catchAsync';
import { deleteOne, getAll, updateOne } from './handlerFactory';

export const createLead = catchAsync(async (req, res, next) => {
  const data = { sessionId: req.body.sessionId, intent: req.body.intent };
  const doc = await Lead.create(data);
  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});

// export const getAllLeads = catchAsync(async (req, res, next) => {
//   const doc = await Lead.find({});
//   res.status(200).json({
//     status: 'success',
//     data: { data: doc },
//   });
// });

export const getAllLeads = getAll(Lead);

export const getPaginatedLeads = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const leads = await Lead.find()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalLeads = await Lead.countDocuments();
  res.json({
    data: leads,
    total: totalLeads,
    page,
    totalPages: Math.ceil(totalLeads / limit),
  });
});

export const leadsStats = catchAsync(async (req, res, next) => {
  const totalLeads = await Lead.countDocuments();
  const intentsValues = ['XFER', 'DAIR', 'DNQ', 'CallBK', 'DNC', 'NI', 'NP', 'A', 'Hang up', 'LB'];

  let statsObj = {};

  await Promise.all(
    intentsValues.map(async (el) => {
      statsObj[el.toLowerCase().replace(' ', '_')] = await Lead.countDocuments({ intent: el });
    }),
  );

  res.status(200).json({ status: 'success', totalLeads, stats: statsObj });
});

// export const deleteLead = deleteOne(Lead);
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const leadId = req.params.id;
  try {
    const result = await Lead.findByIdAndDelete(leadId);
    if (!result) {
      res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLead = updateOne(Lead);
