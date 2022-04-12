const HealthcareService = require('../models/healthcare_service_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createHealthcareService = catchAsync(async (req, res, next) => {
  req.body._service = req.organization._service;
  const location = await HealthcareService.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      location,
    },
  });
});

exports.getAllHealthcareService = catchAsync(async (req, res, next) => {
  const allHealthcareService = await HealthcareService.find({
    _service: req.params.serv,
  }).populate('location');

  if (!allHealthcareService)
    return next(new AppError('service id not found', 404));

  res.status(200).json({
    status: 'success',
    result: allHealthcareService.length,
    data: {
      getAllHealthcareService: allHealthcareService,
    },
  });
});

exports.updateHealthcareService = catchAsync(async (req, res, next) => {
  const updatedHealthcareService = await HealthcareService.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedHealthcareService) return next(new AppError('Not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedHealthcareService,
    },
  });
});
