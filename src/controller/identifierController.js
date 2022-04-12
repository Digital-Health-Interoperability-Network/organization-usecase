/* eslint-disable eqeqeq */
/* eslint-disable node/no-unsupported-features/es-syntax */
const Location = require('../models/location_model');
const Organization = require('../models/organization_model');
const Practitioner = require('../models/_Personnel/Practitioner/practitioner_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.identifier.push(...body);
  await data.save();
  return data;
};

const updateData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.identifier.forEach((e, i) => {
    const found = body.find((el) => el._id == e._id);
    if (found) {
      data.identifier[i] = found;
    }
  });
  await data.save();
  return data;
};

const deleteData = async (id, dataId, Model) => {
  const data = await Model.findById(id);
  const filteredData = data.identifier.filter((e) => e._id != dataId);
  // console.log(filteredData);

  data.identifier = filteredData;
  data.save();
  return data;
};

exports.createIdentifier = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitoner')) {
    const practitioner = await Practitioner.findById(id);
    if (req.organization._personnel != practitioner._personnel) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    data = await createData(id, Practitioner, req.body.identifier);
  }
  // Organization
  if (req.baseUrl.startsWith('/api/v1/organization')) {
    const organization = await Organization.findById(id);
    if (req.organization._id != organization._id) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    data = await createData(id, Organization, req.body.identifier);
  }
  // location
  if (req.baseUrl.startsWith('/api/v1/location')) {
    const location = await Location.findById(id);
    if (req.organization._id != location.organization) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    data = await createData(id, Location, req.body.identifier);
    //
  }

  res.status(201).json({
    status: 'success',
    data: {
      identifier: data.identifier,
    },
  });
});

exports.updateIdentifier = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await updateData(id, Practitioner, req.body.identifier);
  }
  // Organization
  if (req.baseUrl.startsWith('/api/v1/organization')) {
    data = await updateData(id, Organization, req.body.identifier);
  }
  // location
  if (req.baseUrl.startsWith('/api/v1/location')) {
    data = await updateData(id, Location, req.body.identifier);
    //
  }

  res.status(200).json({
    status: 'success',
    data: {
      identifier: data.identifier,
    },
  });
});

exports.deleteIdentifier = catchAsync(async (req, res, next) => {
  const { id, id1 } = req.params;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await deleteData(id, id1, Practitioner);
  }
  // Organization
  if (req.baseUrl.startsWith('/api/v1/organization')) {
    data = await deleteData(id, id1, Organization);
  }
  // location
  if (req.baseUrl.startsWith('/api/v1/location')) {
    data = await deleteData(id, id1, Location);
    //
  }

  res.status(204).json({
    status: 'success',
    data,
  });
});
