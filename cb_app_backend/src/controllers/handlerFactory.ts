import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Model as MongooseModel, Document, Query, PopulateOptions, Schema } from 'mongoose';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';
import User from '../models/usersModel';
import { MyUser } from '../types/users';
// we pass in modal and then the function that returns an async fun

export const createOne = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const doc = await Model.create(req.body);
    if (!doc) return next(new AppError('No document found with that id', 404));
    res.status(201).json({
      status: 'success',
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
    if (!doc) return next(new AppError('No doc found with that ID.', 404));

    req.deletedDoc = doc;
    req.model = Model;
    next();
    // res.status(204).json({
    //   status: 'deleted',
    //   data: null,
    // });
  });

export const updateOne = <T extends Document>(Model: MongooseModel<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!doc) return next(new AppError('No document found with that Id', 404));

    res.status(200).json({
      status: 'success',
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

    if (!doc) return next(new AppError('No document found with that id', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = <T extends Document>(Model: MongooseModel<T>): RequestHandler =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const modelArrName = `${Model.modelName.toLowerCase()}s` as keyof MyUser;

    // Safely access `req.user` properties with type assertion
    const userArray = (req.user[modelArrName] as Schema.Types.ObjectId[]) || [];

    const filter = { _id: { $in: userArray } };

    // Ensure the request query is properly typed
    const features = new APIFeatures(Model.find(filter), req.query as { [key: string]: string })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const doc = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
