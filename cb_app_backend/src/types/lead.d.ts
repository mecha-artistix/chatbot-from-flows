import { Date, Document, Types } from 'mongoose';

export interface ISession extends Document {
  lead?: Types.ObjectId;
  createdAt: Date;
  sessionId: string;
  intent: string;
}

export interface ILead extends Document {
  user?: Types.ObjectId;
  name?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  dataSource?: string;
  sessions?: ISession[];
}

export interface ILeadDataSource extends Document {
  user?: Types.ObjectId;
  name?: string;
  createdAt: Date;
  leads?: ILead[];
}

export interface ILeadsCollectionFile {
  name?: string;
  email?: string;
  phone?: string;
}

type intentsValues = ['XFER' | 'DAIR' | 'DNQ' | 'CallBK' | 'DNC' | 'NI' | 'NP' | 'A' | 'Hang_Up' | 'LB'];
