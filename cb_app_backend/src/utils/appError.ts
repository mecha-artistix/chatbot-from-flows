class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  path?: string;
  value?: number | null;
  code?: number;
  errors?: Record<string, any>;
  errorResponse?: {
    errmsg: string;
    [key: string]: any; // Allows for additional properties
  };

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
