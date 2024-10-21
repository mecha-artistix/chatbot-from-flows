import { Request, Response } from "express";
import Bull from "bull";
import multer from "multer";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import { ILeadsCollectionFile } from "../types/lead";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
// import { LeadDataSource, Lead } from '../models/leadModel';
import { LeadsCollection, Lead } from "../models/leadModel";

// CSV FILE
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/leads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `leads-${req?.user?.id}-${Date.now()}.${ext}`);
  },
});

const csvFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("text")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a sheet! Please upload a valid sheet", 400), false);
  }
};

const upload = multer({ storage: csvStorage, fileFilter: csvFilter });
export const uploadLeadsCollection = upload.single("csvFile");

// Add LeadData source Creation and Leads creation to Queue

export const createLeadsCollection = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError("User was not found", 404));

  if (!req.file) {
    return next(new AppError("File was not found", 500));
  }

  //  CREATE COLLECTION DOCUMENT
  req.body.name = req.file.filename;
  if (req.user) req.body.user = req.user._id;
  const leadsDataSource = await LeadsCollection.create(req.body);
  if (!leadsDataSource) return next(new AppError("file could not be uploaded", 404));

  // READ FROM CSV AND CREATE LEAD FROM EACH ROW
  const results: ILeadsCollectionFile[] = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", async (data: ILeadsCollectionFile) => {
      const cleanedData = Object.keys(data).reduce((acc, key) => {
        const cleanedKey = key.replace(/\s+/g, "").toLowerCase();
        acc[cleanedKey] = data[key];
        return acc;
      }, {} as ILeadsCollectionFile);
      // CREATE LEAD DOCUMENT
      const leadObj = {
        user: req?.user?._id,
        leadsCollection: leadsDataSource._id,
        ...cleanedData,
      };
      const lead = await Lead.create(leadObj);
      // PUSH NEWLY CREATED LEAD TO LEADDATASOURCE DOC CREATED ABOVE
      await LeadsCollection.findByIdAndUpdate(
        leadsDataSource._id,
        { $push: { leads: lead._id } },
        { new: true, useFindAndModify: false },
      );

      results.push(data);
    })

    .on("error", (err) => {
      // Handle any file reading errors
      return next(new AppError("Error processing the file", 500));
    });
  res.status(201).json({
    status: "success",
    data: { data: leadsDataSource },
  });
});

export const getLeadsCollection = getAll(LeadsCollection);

export const getLeadsfromCollection = catchAsync(async (req, res, next) => {
  const doc = await LeadsCollection.findOne({ _id: req.params.id }).populate({
    path: "leads",
    options: { sort: { createdAt: -1 } },
  });
  if (!doc) return next(new AppError("Collection not found", 404));
  const totalLeads = doc?.leads?.length;
  res.status(200).json({ status: "success", totalLeads, data: { data: doc } });
});

/*
 // .on('end', async () => {
    //   const jsonPath = path.join(__dirname, '../../public/leads', `${path.parse(req.file!.filename).name}.json`);
    //   fs.writeFileSync(jsonPath, JSON.stringify(results));
    // })
    
export const createLeadsDataSource = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('File was not found', 500));
  }

  const results: ILeadsCollectionFile[] = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data: ILeadsCollectionFile) => {
      console.log(data);
      results.push(data);
    })
    .on('end', async () => {
      const jsonPath = path.join(__dirname, '../../public/leads', `${path.parse(req.file!.filename).name}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(results));

      req.body.name = req.file!.filename;
      if (req.user) req.body.user = req.user._id;
      const leadsData = await LeadDataSource.create(req.body);
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
});

*/
