import { NextFunction, Response, ErrorRequestHandler } from 'express';
import AppError from '../utils/appError';
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastErrorDB = (error: AppError) => {
  const message = `invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error: AppError) => {
  const value = error.errorResponse?.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)![0];
  const message = `duplicate field value: ${value}. Please use different value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error: AppError) => {
  const errors = error.errors ? Object.values(error.errors).map((el) => el.message) : [];
  const message = `invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid Token Please login again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Login again.', 401);

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or unknown error
  else {
    // 1) Log error
    // console.error('Error ⚠️ ', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somethin went very wrong!',
    });
  }
};

// const globalErrorHandler: ErrorRequestHandler = (
//   err: AppError | any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    const error = { ...err };

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: AppError = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else {
    // Fallback for unknown environments
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
