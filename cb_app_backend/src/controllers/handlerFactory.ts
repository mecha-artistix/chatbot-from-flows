import { Request, Response, NextFunction, RequestHandler } from "express";
import { Model as MongooseModel, Document, Query, PopulateOptions, Schema } from "mongoose";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import APIFeatures from "../utils/apiFeatures";
import User from "../models/usersModel";
import { MyUser } from "../types/users";
// we pass in modal and then the function that returns an async fun

export const createOne = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const doc = await Model.create(req.body);
    if (!doc) return next(new AppError("No document found with that id", 404));
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
    // next();
  });

export const deleteOne = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request & Express.DeleteRequest, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete({ _id: req.params.id });
    // const doc = await Model.findById({ _id: req.params.id });
    if (!doc) return next(new AppError("No doc found with that ID.", 404));

    req.deletedDoc = doc;
    req.model = Model;
    // next();
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  });

export const updateOne = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!doc) return next(new AppError("No document found with that Id", 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

// Define the type for the query result
type QueryResult<T extends Document> = Query<T | null, T>;

export const getOne = <T extends Document>(Model: MongooseModel<T>, popOptions?: PopulateOptions | PopulateOptions[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    let query: QueryResult<T> = Model.findById(id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) return next(new AppError("No document found with that id", 404));
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.user) {
    //   return next(new AppError('User not authenticated', 401));
    // }
    let filter = {};
    if (req.user) filter["user"] = req.user.id;
    const features = new APIFeatures(Model.find(filter), req.query as { [key: string]: string })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const total = await Model.countDocuments(filter);
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

type GetAllOfUser = (model: string) => RequestHandler;

export const getAllOfUser: GetAllOfUser = (model) =>
  catchAsync(async (req, res, next) => {
    if (!req.user) return next(new AppError("you are not logged in", 401));
    if (!req.user[model]) return next(new AppError(`Model '${model}' not found on user`, 400));

    const populatedUser = await req.user.populate({ path: model, select: "" });
    const data = populatedUser[model];
    res.status(200).json({
      status: "success",
      length: data.length,
      data: {
        data,
      },
    });
  });
