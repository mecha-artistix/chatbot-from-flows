import mongoose, { Document, Schema, Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { MyUser } from '../types/users';
const userSchema = new mongoose.Schema<MyUser>({
  // USER PROFILE
  firstName: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  lastName: { type: String },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  username: { type: String, required: [true, 'Please provide a username'] },

  photo: { type: String, default: 'default.jpg' },

  dateOfBirth: { type: Date },
  gender: { type: String },
  phone: {
    type: String,
    match: /^[0-9+\-\s()]*$/,
  },
  address: { type: String },
  country: { trype: String },
  // USER CONTENT
  role: {
    type: String,
    enum: ['user', 'member', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el: string): boolean {
        return el === this?.password;
      },
      message: 'password did not match',
    },
    select: false,
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
  flowcharts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flowchart' }],
  bots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bot' }],
  leadsCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeadsCollection' }],
});

userSchema.pre('save', async function (this: MyUser, next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = '';
  next();
});

// removing inactive users from find()
// userSchema.pre(/^find/, function (this: Query<any, MyUser, any>, next) {
//   // this point to currect query
//   // we are doing notEqualto fasle because some users dont have the active  prop
//   this.find({ active: { $ne: false } });
//   next();
// });

// instance method - method that is awailable on all docs of certain collection
userSchema.methods.correctPassword = async function (this: MyUser, candidatePassword: string, userPassword: string) {
  // this.password  = undefined as wehave selected false in model schema
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (this: MyUser, JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
