const PractitionerRole = require('../models/_Personnel/Practitioner/practitioner_role_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPractitionerRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.body.practitioner = id;
  req.body.organization = req.organization._id;

  //check if practitioner role code already exist
  const isCode = await PractitionerRole.findOne({
    practitioner: id,
    code: req.body.code,
  });

  if (isCode) {
    next(new AppError(`Practitioner already is a ${req.body.code}`, 400));
  }

  const newPractitionerRole = await PractitionerRole.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      newPractitionerRole,
    },
  });
});

exports.getAllPractitionerRole = catchAsync(async (req, res, next) => {
  const allPractitionerRole = await PractitionerRole.find({}).populate(
    'practitioner'
  );
  res.status(200).json({
    status: 'Success',
    data: {
      allPractitionerRole,
    },
  });
});

exports.getPractitionerRole = catchAsync(async (req, res, next) => {
  //here the req.params.id is the id of the practitioner
  const practitionerRole = await PractitionerRole.findOne({
    practitioner: req.params.id,
  });

  if (!practitionerRole)
    return next(new AppError('No PractitionerRole found', 404));

  res.status(200).json({
    status: 'Success',
    data: {
      practitionerRole,
    },
  });
});

exports.updatePractitionerRole = catchAsync(async (req, res, next) => {
  //here the req.params.id is the id of the practitioner
  const practitionerRole = await PractitionerRole.findOneAndUpdate(
    {
      practitioner: req.params.id,
    },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!practitionerRole)
    return next(new AppError('No PractitionerRole found', 404));

  res.status(200).json({
    status: 'Success',
    data: {
      updatedPractitionerRole: practitionerRole,
    },
  });
});
