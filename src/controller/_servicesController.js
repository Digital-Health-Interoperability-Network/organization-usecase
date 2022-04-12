const _Service = require('../models/_services_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { updateOrg } = require('../services/organization');

exports.create_Service = catchAsync(async (req, res, next) => {
  req.body.organization = req.organization.id;
  const new_Service = await _Service.create(req.body);

  // 2) add the new_service id to the organization doc
  await updateOrg(req.organization.id, new_Service.id, '_service');

  res.status(201).json({
    status: 'success',
    data: {
      new_Service: new_Service,
    },
  });
});

exports.get_Service = catchAsync(async (req, res, next) => {
  const _service = await _Service
    .findOne({
      _id: req.organization._service,
    })
    .populate('healthcareService');

  if (!_service) return next(new AppError('_Service id not found'));

  res.status(200).json({
    status: 'success',
    data: {
      _service,
    },
  });
});

exports.getAll_Services = catchAsync(async (req, res, next) => {
  const _services = await _Service.find({});

  res.status(200).json({
    status: 'success',
    result: _services.length,
    data: {
      _services,
    },
  });
});

exports.update_Service = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const updated_Service = await _Service.findByIdAndUpdate(
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
      // eslint-disable-next-line camelcase
      updated_Service,
    },
  });
});

exports.delete_Service = catchAsync(async (req, res, next) => {
  const _service = await _Service.findByIdAndDelete(req.params.id);

  if (!_service) return next(new AppError('_Service id not found'));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
