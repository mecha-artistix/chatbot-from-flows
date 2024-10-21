import { Date, Document, Types } from 'mongoose';

export interface ISession extends Document {
  user?: Types.ObjectId;
  createdAt: Date;
  lead?: Types.ObjectId;
  intent?: string;
  sid: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  fromFormatted?: string;
  toFormatted?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  price?: number;
  conversation?: string;
}

export interface ILead extends Document {
  user?: Types.ObjectId;
  name?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  leadsCollection?: string;
  sessions?: Types.ObjectId;
}

// export interface ILeadDataSource extends Document {
export interface ILeadCollection extends Document {
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
