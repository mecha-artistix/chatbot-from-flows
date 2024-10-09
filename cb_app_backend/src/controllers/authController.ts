import { Response, CookieOptions, RequestHandler } from 'express';
import { MyUser } from '../types/users';

import { promisify } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/usersModel';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN is not defined');
  }
  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

const createSendToken = (user: MyUser, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN is not defined');
  }
  // Calculate the cookie expiration date
  const cookieExpirationDate = new Date(Date.now() + parseInt(expiresIn, 10) * 24 * 60 * 60 * 1000);
  const cookieOptions: CookieOptions = {
    expires: cookieExpirationDate,
    httpOnly: false,
    secure: true,
    sameSite: 'none',
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = '';
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const newUser: MyUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) check if  user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password); // correct password is instance method (available on all doc of cetrain collection) defined in userSchema.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) send token to client
  createSendToken(user, 200, res);
});

// PROTECT ROUTES > MIDDLE WARE FOR AUTHENTICATING VIA JWT
function getJwtFromCookie(cookieHeader: string): string | null {
  if (!cookieHeader) return null;

  const jwtPrefix = 'jwt=';
  const startIdx = cookieHeader.indexOf(jwtPrefix);

  if (startIdx === -1) return null;

  const endIdx = cookieHeader.indexOf(';', startIdx);

  return endIdx === -1
    ? cookieHeader.substring(startIdx + jwtPrefix.length)
    : cookieHeader.substring(startIdx + jwtPrefix.length, endIdx);
}

export const protect: RequestHandler = catchAsync(async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  // 1) Get the token
  let token: string | null;
  if (req.headers.cookie) {
    token = getJwtFromCookie(req.headers.cookie);
    // token = req.cookies.jwt;
    console.log('token', token);
    if (!token) return next(new AppError('You are not logged in', 401));
  } else {
    return next(new AppError('You are not logged in', 401));
  }

  // 2) Token verification
  let decoded: JwtPayload;
  try {
    decoded = (await jwt.verify(token, jwtSecret)) as JwtPayload;
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) return next(new AppError('The user no longer exists', 401));

  // 4) Check if user changed password after the token was issued
  if (decoded.iat !== undefined && freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  // GRANT ACCESS
  req.user = freshUser;
  next();
});

export const verify: RequestHandler = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'User is authenticated',
    user: req.user,
  });
});

export const logout: RequestHandler = catchAsync(async (req, res, next) => {
  // res.clearCookie('jwt', { path: '/' });
  // res.clearCookie('jwt', {
  //   path: '/',
  //   httpOnly: false,
  //   secure: true,
  //   sameSite: 'none',
  // });

  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});
