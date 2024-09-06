import express, { Application, Request, Response, NextFunction } from 'express';
import globalErrorHandler from './controllers/errorController';
import cors, { CorsOptions, CorsRequest } from 'cors';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import { catchAsync } from './utils/catchAsync';
import AppError from './utils/appError';
import userRoutes from './routes/userRoutes';
import flowchartRoutes from './routes/flowchartRoutes';

const { BASE_URL } = process.env;
const ALLOWED_ORIGINS = ['127.0.0.1', 'localhost', '91.107.194.217', '172.31.149.141'];
const { window } = new JSDOM('');
const dompurify = DOMPurify(window);

const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = dompurify.sanitize(req.body[key]);
      }
    }
  }
  next();
};

const app: Application = express();

//  MIDDLEWARES
/* eslint-disable no-console */
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  //   app.use(morgan('combined'));
}

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (
      !origin ||
      ALLOWED_ORIGINS.some((allowedOrigin) => {
        const { hostname } = new URL(origin);
        return allowedOrigin === hostname;
      })
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());
// Limit requests from the same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour',
});
// app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(sanitizeInput);
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration'], // Allow 'duration' parameter to be repeated in the query string
  }),
);

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.requestTime = new Date().toString();
    console.log('hello 😇', req.requestTime);
    next();
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'connected',
    message: 'this is a message from nodejs backend',
  });
});

app.use(BASE_URL + '/users', userRoutes);

app.use(BASE_URL + '/flowcharts', flowchartRoutes);

app.get('/error-test', (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError('This is a test error', 500);
  next(err);
});

// ERROR (GLOBAL) HANDLING MIDDLEWARE. THIS TAKES IN 4 ARGS.EXPRESS RECOGNIZES  THIS MIDDLEWARE FUNC BY THE 4 ARGS
app.use(globalErrorHandler);
export default app;
