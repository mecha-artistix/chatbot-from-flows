import * as express from 'express';
import { MyUser } from './users';
import { Document, Model } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      requestTime: string;
      user?: MyUser;
      model?: Model;
      deletedDoc?: Document;
    }

    interface DeleteRequest extends Request {
      deletedDoc?: Document;
      model?: Model<Document>;
    }
  }
}
