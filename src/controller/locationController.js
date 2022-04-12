const Location = require('../models/location_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createLocation = catchAsync(async (req, res, next) => {
  // if (req.baseUrl.startsWith('/api/v1/healthcareservice'))
  //   console.log('yea right!!');
  const { id } = req.params;
  req.body.healthcareservice = id;
  req.body.organization = req.organization._id;
  const location = await Location.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      location,
    },
  });
});

exports.updateLocation = catchAsync(async (req, res, next) => {
  const { id, id1 } = req.params;
  const updatedLocation = await Location.findOneAndUpdate(
    { healthcareService: id, _id: id1, organization: req.organization._id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedLocation) return next(new AppError('Location not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedLocation,
    },
  });
});

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const { id, id1 } = req.params;
  const location = await Location.findOneAndDelete(
    { healthcareService: id, _id: id1, organization: req.organization._id },
    req.body,
    { runValidators: true, new: true }
  );
  if (!location) return next(new AppError('Location not found', 404));

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
