const mongoose = require('mongoose');
const Identifier = require('./identifier_model');
const Telecom = require('./telecom_schema');

const healthcareServiceSchema = new mongoose.Schema(
  {
    identifier: [Identifier],
    active: {
      type: String,
    },
    providedBy: {
      String,
    },
    category: [Object],
    type: [Object],
    speciality: String,
    // location: String,
    name: String,
    comment: String,
    extraDetails: String,
    photo: String,
    telecom: [Telecom],
    coverageArea: [Object],
    serviceProvisionCode: [Object],
    eligibility: [Object],
    program: [Object],
    charactristics: String,
    referralMethod: [Object],
    appointmentRequired: Boolean,
    // availableTime: {
    //   type: Map,
    //   of: [Object],
    // },
    notAvailable: [Object],
    availabilityExceptions: String,
    endpoint: [Object],
    _service: {
      type: mongoose.Schema.ObjectId,
      ref: '_Service',
    },
  },
  // { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

healthcareServiceSchema.virtual('location', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'healthcareservice',
});

const HealthcareService = mongoose.model(
  'HealthcareService',
  healthcareServiceSchema
);
module.exports = HealthcareService;
