const mongoose = require('mongoose');

const _serviceSchema = new mongoose.Schema(
  {
    outpatientService: {
      type: Boolean,
      default: false,
    },
    inpatientServices: {
      type: Boolean,
      default: false,
    },
    surgicalServices: {
      type: [String],
    },
    obstericsAndGynecologyServices: {
      type: [String],
    },
    pediatricsServices: {
      type: [String],
    },
    dentalServices: {
      type: [String],
    },
    specialClinicalServices: {
      type: [String],
    },
    totalNumberOfBeds: {
      type: Number,
      default: 0,
    },
    numberOfBedsAvailable: {
      type: Number,
      default: 0,
    },
    onsiteLaboratory: {
      type: Boolean,
      default: false,
    },
    motuaryServices: {
      type: Boolean,
      default: false,
    },
    medicalServices: {
      type: Boolean,
      default: false,
    },
    ambulanceServices: {
      type: Boolean,
      default: false,
    },
    // healthcareServices: virtual populate
    organization: {
      ref: 'Organization',
      type: mongoose.Schema.ObjectId,
      unique: [true, 'Organization service already exist.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

_serviceSchema.virtual('healthcareService', {
  ref: 'HealthcareService',
  localField: '_id',
  foreignField: '_service',
});

const _Service = mongoose.model('_Service', _serviceSchema);
module.exports = _Service;
