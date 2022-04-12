/* eslint-disable eqeqeq */
const Organization = require('../models/organization_model');
const Practitioner = require('../models/_Personnel/Practitioner/practitioner_model');
const Contact = require('../models/contact_model');
const Location = require('../models/location_model');

const HealthcareService = require('../models/healthcare_service_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {
  createData,
  updateData,
  deleteData,
  practitionerVerification,
  contactVerification,
  organizationVerification,
  healthcareServiceVerification,
} = require('../services/telecomService');

exports.createTelecom = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await createData(id, Practitioner, req.body);
  }
  // Organization
  else if (req.baseUrl.startsWith('/api/v1/organization')) {
    data = await createData(id, Organization, req.body);
  }
  // location
  else if (req.baseUrl.startsWith('/api/v1/location')) {
    data = await createData(id, Location, req.body);
  }
  // Contact
  else if (req.baseUrl.startsWith('/api/v1/contact')) {
    data = await createData(id, Contact, req.body);
  }
  // health care service
  else if (req.baseUrl.startsWith('/api/v1/healthcareservice')) {
    data = await createData(id, HealthcareService, req.body);
  } else {
    return next(new AppError('Invalid url', 405));
  }

  res.status(201).json({
    status: 'success',
    data: {
      telecom: data.telecom[data.telecom.length - 1],
    },
  });
});

//update telecom
exports.updateTelecom = catchAsync(async (req, res, next) => {
  let data = {};
  if (req.body.telecom.value) {
    //practitioner
    if (req.baseUrl.startsWith('/api/v1/practitioner')) {
      const practitioner = await practitionerVerification(
        Practitioner,
        req.params.id,
        req.organization._personnel,
        next
      );
      data = await updateData(
        practitioner,
        req.params.id1,
        req.body.telecom.value,
        next
      );
      data = data.telecom.find((e) => e._id == req.params.id1);
    }
    //location
    else if (req.baseUrl.startsWith('/api/v1/location')) {
      //1) verify that the location exists
      const location = await Location.findById(req.params.id);
      if (!location) {
        return next(new AppError('No Location with that id', 404));
      }
      //2) verify that the organization is the owner of this location
      if (
        req.organization._service !==
        (await HealthcareService.findById(location.healthcareService)._service)
      ) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
      data = await updateData(
        location,
        req.params.id1,
        req.body.telecom.value,
        next
      );
      data = data.telecom.find((e) => e._id == req.params.id1);
    }
    //contact
    else if (req.baseUrl.startsWith('/api/v1/contact')) {
      const contact = await contactVerification(
        Contact,
        req.params.id,
        req.organization._id,
        next
      );
      data = await updateData(
        contact,
        req.params.id1,
        req.body.telecom.value,
        next
      );
      data = data.telecom.find((e) => e._id == req.params.id1);
    }
    //healthcare service
    else if (req.baseUrl.startsWith('/api/v1/healthcareservice')) {
      const healthcareService = await healthcareServiceVerification(
        HealthcareService,
        req.params.id,
        req.organization._service,
        next
      );
      data = await updateData(
        healthcareService,
        req.params.id1,
        req.body.telecom.value,
        next
      );
      data = data.telecom.find((e) => e._id == req.params.id1);
    }
    //organization
    else if (req.baseUrl.startsWith('/api/v1/organization')) {
      //1) Verify that the organization is the owner of this practitioner
      await organizationVerification(req.params.id, req.organization._id, next);
      data = await updateData(
        req.organization,
        req.params.id1,
        req.body.telecom.value,
        next
      );
      data = data.telecom.find((e) => e._id == req.params.id1);
    }
    //else block
    else {
      return next(new AppError('Invalid url', 405));
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      updated_telecom: data,
    },
  });
});

//only done for organization
exports.deleteTelecom = catchAsync(async (req, res, next) => {
  //practitioner
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    //1) verify that the practitioner exists
    const practitioner = await Practitioner.findById(req.params.id);
    if (!practitioner) {
      return next(new AppError(`No Practitioner with that id`, 404));
    }
    //2) Verify that the organization is the owner of this practitioner
    if (practitioner._personnel !== req.organization._personnel) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    const data = await deleteData(Practitioner, req.params.id, req.params.id1);
    console.log(data);
  }
  //Organization
  else if (req.baseUrl.startsWith('/api/v1/organization')) {
    //1) Verify that the organization is the owner of this practitioner
    if (req.params.id !== req.organization._id) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    const data = await deleteData(Organization, req.params.id, req.params.id1);
    console.log(data);
  }
  // Location
  else if (req.baseUrl.startsWith('/api/v1/location')) {
    //1) verify that the location exists
    const location = await Location.findById(req.params.id);
    if (!location) {
      return next(new AppError('No Location with that id', 404));
    }
    //2) verify that the organization is the owner of this location
    if (
      req.organization._service !==
      (await HealthcareService.findById(location.healthcareService)._service)
    ) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    const data = await deleteData(Location, req.params.id, req.params.id1);
    console.log(data);
  }
  // contact
  else if (req.baseUrl.startsWith('/api/v1/contact')) {
    //1) verify that the practitioner exists
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(new AppError(`No Contact with that id`, 404));
    }
    //2) Verify that the organization is the owner of this practitioner
    if (`${contact.organization}` !== `${req.organization._id}`) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    const data = await deleteData(Contact, req.params.id, req.params.id1);
    console.log(data);
  }
  //healthcare service
  else if (req.baseUrl.startsWith('/api/v1/healthcareservice')) {
    await healthcareServiceVerification(
      HealthcareService,
      req.params.id,
      req.organization._service,
      next
    );
    const data = await deleteData(
      HealthcareService,
      req.params.id,
      req.params.id1
    );
    console.log(data);
  } else {
    return next(new AppError('Invalid url', 405));
  }

  res.status(204).json({
    status: 'success',
  });
});
