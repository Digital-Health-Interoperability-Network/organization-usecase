const Organization = require('../models/organization_model');
const APIFeatures = require('../services/apiFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findOne({
    _id: req.params.id,
  }).populate('contact');

  if (!organization) return next(new AppError('Organization id not found'));

  res.status(200).json({
    status: 'success',
    data: {
      organization,
    },
  });
});

exports.getAllOrganizations = catchAsync(async (req, res, next) => {
  // const organizations = await Organization.find({}).populate('contact');
  const features = new APIFeatures(
    Organization.find().populate('contact'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const organizations = await features.query;

  res.status(200).json({
    status: 'success',
    result: organizations.length,
    data: {
      organizations,
    },
  });
});

exports.updateOrganization = catchAsync(async (req, res, next) => {
  const updatedOrganization = await Organization.findByIdAndUpdate(
    req.organization._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedOrganization,
    },
  });
});

exports.deleteOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findByIdAndDelete(req.params.id);

  if (!organization) return next(new AppError('Organization id not found'));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Get current user route
exports.getMe = (req, res, next) => {
  req.params.id = req.organization.id;
  next();
};

// //get single user
// exports.getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   res.status(201).json({
//     status: 'successful',
//     user,
//   });
// });
