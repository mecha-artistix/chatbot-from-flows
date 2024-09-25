import { Request, Response } from 'express';
import { Lead } from '../models/leadModel';
import { deleteOne, getAll, updateOne } from './handlerFactory';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';
import { ILead, ILeadsCollectionFile } from '../types/lead';

export const getLeads = getAll(Lead);

// export const getLeads = catchAsync(async (req, res, next) => {
//   res.status(200).json({ status: 'working' });
// });

export const createLead = catchAsync(async (req, res, next) => {
  res.status(201).json({ status: 'working' });
});

export const deleteLead = catchAsync(async (req, res, next) => {
  res.status(201).json({ status: 'working' });
});

export const updateLead = catchAsync(async (req, res, next) => {
  res.status(201).json({ status: 'working' });
});
