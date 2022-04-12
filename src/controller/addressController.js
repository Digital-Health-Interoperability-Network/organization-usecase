/* eslint-disable eqeqeq */
/* eslint-disable node/no-unsupported-features/es-syntax */
const Location = require('../models/location_model');
const Organization = require('../models/organization_model');
const Practitioner = require('../models/_Personnel/Practitioner/practitioner_model');
const Contact = require('../models/contact_model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

const createData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.address.push(...body);
  await data.save();
  return data;
};

const updateData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.address.forEach((e, i) => {
    const found = body.find((el) => el._id == e._id);
    if (found) {
      data.address[i] = found;
    }
  });
  await data.save();
  return data;
};

const deleteData = async (id, dataId, Model) => {
  const data = await Model.findById(id);
  const filteredData = data.address.filter((e) => e._id != dataId);
  // console.log(filteredData);

  data.address = filteredData;
  data.save();
  return data;
};

exports.createAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let data;

  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await createData(id, Practitioner, req.body.address);
  }
  // Organization
  if (req.baseUrl.startsWith('/api/v1/organization')) {
    data = await createData(id, Organization, req.body.address);
  }
  // location
  if (req.baseUrl.startsWith('/api/v1/location')) {
    data = await createData(id, Location, req.body.address);
  }
  // Contact
  if (req.baseUrl.startsWith('/api/v1/contact')) {
    data = await createData(id, Contact, req.body.address);
  }

  res.status(201).json({
    status: 'success',
    data: {
      address: data.address,
    },
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await updateData(id, Practitioner, req.body.address);
  }
  // Organization
  if (req.baseUrl.startsWith('/api/v1/organization')) {
    data = await updateData(id, Organization, req.body.address);
  }
  // location
  if (req.baseUrl.startsWith('/api/v1/location')) {
    data = await updateData(id, Location, req.body.address);
  }
  // Contact
  if (req.baseUrl.startsWith('/api/v1/contact')) {
    data = await updateData(id, Contact, req.body.address);
  }

  res.status(200).json({
    status: 'success',
    data: {
      address: data.address,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
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
  }
  // Contact
  if (req.baseUrl.startsWith('/api/v1/contact')) {
    data = await deleteData(id, id1, Contact);
  }

  res.status(204).json({
    status: 'success',
    data,
  });
});
