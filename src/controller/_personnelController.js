/* eslint-disable guard-for-in */
const _Personnel = require('../models/_Personnel/_personnel_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { updateOrg } = require('../services/organization');

exports.create_Personnel = catchAsync(async (req, res, next) => {
  req.body.organization = req.organization.id;
  const new_personnel = await _Personnel.create(req.body);

  // 2) add the new_service id to the organization doc
  await updateOrg(req.organization.id, new_personnel.id, '_personnel');

  res.status(201).json({
    status: 'success',
    data: {
      new_Personnel: new_personnel,
    },
  });
});

exports.get_MyPersonnel = catchAsync(async (req, res, next) => {
  const _personnel = await _Personnel
    .findOne({
      _id: req.organization._personnel,
    })
    .populate('practitioners');

  if (!_personnel) return next(new AppError('_personnel id not found'));

  const { _id, organization } = _personnel._doc;

  //remove _id, organizationId, and _v from the _personnel doc
  delete _personnel._doc.organization;
  delete _personnel._doc.id;
  delete _personnel._doc.__v;

  const keys = Object.keys(_personnel._doc);
  const values = Object.values(_personnel._doc);

  const newDoc = keys.map((el, i) => {
    const data = {};
    // data[el] = values[i];
    data.id = i;
    data.roles = keys[i];
    data.aggregate = values[i];
    return data;
  });

  res.status(200).json({
    status: 'success',
    data: {
      _id,
      organization,
      _personnel: newDoc,
    },
  });
});

exports.get_Personnel = catchAsync(async (req, res, next) => {
  const _personnel = await _Personnel.findOne({
    _id: req.params.id,
  });

  if (!_personnel) return next(new AppError('_personnel id not found'));

  res.status(200).json({
    status: 'success',
    data: {
      _personnel,
    },
  });
});
