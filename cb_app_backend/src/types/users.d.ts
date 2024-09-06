import { Document, Schema } from 'mongoose';

export interface MyUser extends Document {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  photo?: string;
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  address: string;
  country: string;
  role: 'user' | 'member' | 'admin';
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  // USER DATA
  active: boolean;
  flowcharts: Schema.Types.ObjectId[];
  bots: Schema.Types.ObjectId[];
}
