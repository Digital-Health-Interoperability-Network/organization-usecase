const Practitioner = require('../models/_Personnel/Practitioner/practitioner_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.create_Practitioner = catchAsync(async (req, res, next) => {
  req.body._personnel = req.organization._personnel;
  const new_practitioner = await Practitioner.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      new_practitioner,
    },
  });
});

exports.getPractitoner = catchAsync(async (req, res, next) => {
  const practitoner = await Practitioner.findById(req.params.id);
  if (!practitoner) return next(new AppError('Practitioner not found'));
  if (`${practitoner._personnel}` !== `${req.organization._personnel}`) {
    return next(
      new AppError('You do not have persmission to perform this action', 403)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      practitoner,
    },
  });
});

exports.updatePractitioner = catchAsync(async (req, res, next) => {
  const updatedPractitioner = await Practitioner.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedPractitioner) return next(new AppError('Practitioner not found'));
  res.status(201).json({
    status: 'success',
    data: {
      updatedPractitioner,
    },
  });
});
exports.getAllMyPractitioners = catchAsync(async (req, res, next) => {
  const practitoners = await Practitioner.find({
    _personnel: req.organization._personnel,
  }).populate('practitionerrole');

  res.status(200).json({
    status: 'success',
    results: practitoners.length,
    data: {
      practitoners,
    },
  });
});
exports.deletePractitioner = catchAsync(async (req, res, next) => {
  const practitioner = await Practitioner.findOne({
    _personnel: req.organization._personnel,
    id: req.params.id,
  });

  if (!practitioner) return next(new AppError('Practitioner not found'));

  res.status(200).json({
    status: 'success',
  });
});
