import { Request, Response } from "express";

import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { deleteOne, getAll, updateOne } from "./handlerFactory";
import { Session } from "../models/SessionModel";
import APIFeatures from "../utils/apiFeatures";

export const createSession = catchAsync(async (req, res, next) => {
  const data = { sessionId: req.body.sessionId, intent: req.body.intent };
  const doc = await Session.create(data);
  res.status(201).json({
    status: "success",
    data: { data: doc },
  });
});

// export const getAllSessions = getAll(Session);
export const getAllSessions = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.user) filter["user"] = req.user.id;
  const features = new APIFeatures(Session.find(filter), req.query as { [key: string]: string })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute the query
  const total = await Session.countDocuments(filter);
  const doc = await features.query;

  // Send response
  res.status(200).json({
    status: "success",
    total,
    data: {
      results: doc.length,
      data: doc,
    },
  });
});

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
/*
export const sessionsStats = catchAsync(async (req, res, next) => {
  if (!req.user) next(new AppError('You are anauthorized', 401));
  const totalLeads = await Session.countDocuments();
  const intentsValues = ['XFER', 'DAIR', 'DNQ', 'CallBK', 'DNC', 'NI', 'NP', 'A', 'Hang_Up', 'LB'];

  let statsObj = {};

  await Promise.all(
    intentsValues.map(async (el) => {
      statsObj[el.replace(' ', '_')] = await Session.countDocuments({ user: req.user?._id, intent: el });
    }),
  );

  res.status(200).json({ status: 'success', totalLeads, stats: statsObj });
});
*/
const intentsValues = ["XFER", "DAIR", "DNQ", "CallBK", "DNC", "NI", "NP", "A", "Hang_Up", "LB"];
export const sessionsStats = catchAsync(async (req, res, next) => {
  if (!req.user) next(new AppError("unauthenticated", 401));
  const user = req.user?._id;
  const sessionStats = await Session.aggregate([
    {
      // Match sessions for the specific user
      $match: { user },
    },
    {
      // Define multiple facets for different aggregations
      $facet: {
        totalCount: [{ $count: "count" }],
        intentCounts: [
          { $match: { intent: { $in: intentsValues } } },
          { $group: { _id: "$intent", count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  const statsObj = {};
  intentsValues.forEach((el) => {
    // const key = el.replace(/\s+/g, '_');
    statsObj[el] = 0;
  });

  if (sessionStats[0].totalCount.length > 0) {
    statsObj["total"] = sessionStats[0].totalCount[0].count;
  } else {
    statsObj["total"] = 0;
  }

  sessionStats[0].intentCounts.forEach((item) => {
    // const key = item._id.replace(/\s+/g, '_');
    statsObj[item._id] = item.count;
  });

  res.status(200).json({ status: "success", stats: statsObj });
});

// export const deleteLead = deleteOne(Lead);
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const leadId = req.params.id;
  try {
    const result = await Session.findByIdAndDelete(leadId);
    if (!result) {
      res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSession = updateOne(Session);
