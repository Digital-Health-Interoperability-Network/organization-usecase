const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/Users/user_model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImages = upload.fields([
  { name: 'frontCover', maxCount: 1 },
  { name: 'backCover', maxCount: 1 },
]);

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  // 1) Front Cover
  if (req.files.frontCover) {
    req.body.frontCover = `frontcover-${Date.now()}-cover.jpeg`;
    await sharp(req.files.frontCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/front/${req.body.frontCover}`);
  }

  // 1) Back image
  if (req.files.backCover) {
    req.body.backCover = `backCover-${Date.now()}-cover.jpeg`;
    await sharp(req.files.backCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/back/${req.body.backCover}`);
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'country',
    'DOB',
    'phone',
    'typeOfId',
    'backCover',
    'frontCover'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

//get All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'user' });

  res.status(201).json({
    status: 'successful',
    users,
  });
});

//delete current userPassword
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//delete all users
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete({});

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Get current user route
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//get single user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(201).json({
    status: 'successful',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // console.log(updatedUser)

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getUserDetails = async (account) => {
  const user = await User.findOne({ account });
  return {
    email: user.email,
    name: user.name,
  };
};
