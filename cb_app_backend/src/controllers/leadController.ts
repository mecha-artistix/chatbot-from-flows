import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';
import { LeadStatus, LeadData } from '../models/leadModel';
import { catchAsync } from '../utils/catchAsync';
import { deleteOne, getAll, updateOne } from './handlerFactory';
import AppError from '../utils/appError';
import { ILeadsDataFile } from 'src/types/lead';

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/leads/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `leads-${req?.user?.id}-${Date.now()}.${ext}`);
  },
});

const csvFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('text')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a sheet! Please upload a valid sheet', 400), false);
  }
};

const upload = multer({ storage: csvStorage, fileFilter: csvFilter });

export const uploadLeadsData = upload.single('csvFile');

export const createLeadsData = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('File was not found', 500));
  } else {
    const results: ILeadsDataFile[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data: ILeadsDataFile) => results.push(data))
      .on('end', async () => {
        const jsonPath = path.join(__dirname, '../../public/leads', `${path.parse(req.file!.filename).name}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(results));

        req.body.dataFile = req.file!.filename;
        const leadsData = await LeadData.create(req.body);
        if (!leadsData) return next(new AppError('file could not be uploaded', 404));
        res.status(201).json({
          status: 'success',
          data: { data: leadsData },
        });
      })
      .on('error', (err) => {
        // Handle any file reading errors
        return next(new AppError('Error processing the file', 500));
      });
  }
});

export const getLeadsData = getAll(LeadData);

export const createLead = catchAsync(async (req, res, next) => {
  const data = { sessionId: req.body.sessionId, intent: req.body.intent };
  const doc = await LeadStatus.create(data);
  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});

export const getAllLeads = getAll(LeadStatus);

export const getPaginatedLeads = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const leads = await LeadStatus.find()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalLeads = await LeadStatus.countDocuments();
  res.json({
    data: leads,
    total: totalLeads,
    page,
    totalPages: Math.ceil(totalLeads / limit),
  });
});

export const leadsStats = catchAsync(async (req, res, next) => {
  const totalLeads = await LeadStatus.countDocuments();
  const intentsValues = ['XFER', 'DAIR', 'DNQ', 'CallBK', 'DNC', 'NI', 'NP', 'A', 'Hang up', 'LB'];

  let statsObj = {};

  await Promise.all(
    intentsValues.map(async (el) => {
      statsObj[el.toLowerCase().replace(' ', '_')] = await LeadStatus.countDocuments({ intent: el });
    }),
  );

  res.status(200).json({ status: 'success', totalLeads, stats: statsObj });
});

// export const deleteLead = deleteOne(Lead);
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const leadId = req.params.id;
  try {
    const result = await LeadStatus.findByIdAndDelete(leadId);
    if (!result) {
      res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLead = updateOne(LeadStatus);
