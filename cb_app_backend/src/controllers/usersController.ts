import User from '../models/usersModel';
import AppError from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import multer from 'multer';

//  create multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // user-USERID-TIMESTAMP => user-2313123-122121321.jpeg
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req?.user?.id}-${Date.now()}.${ext}`);
  },
});

//  create multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload a valid image', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single('photo');

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates', 400));
  }

  if (req.file) req.body.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user?.id, req.body, { new: true, runValidators: true });

  res.status(200).json({ status: 'success', data: { user } });
});
