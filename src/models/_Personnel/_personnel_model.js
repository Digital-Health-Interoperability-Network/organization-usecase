const mongoose = require('mongoose');

const _personnelSchema = new mongoose.Schema(
  {
    numberOfDoctors: {
      type: Number,
      default: 0,
    },
    numberOfPharmacists: {
      type: Number,
      default: 0,
    },
    numberOfPharmacyTechnicians: {
      type: Number,
      default: 0,
    },
    numberOfDentists: {
      type: Number,
      default: 0,
    },
    numberOfDentalTechnicians: {
      type: Number,
      default: 0,
    },
    numberOfNurses: {
      type: Number,
      default: 0,
    },
    numberOfMidwifes: {
      type: Number,
      default: 0,
    },
    numberofLabTechnicians: {
      type: Number,
      default: 0,
    },
    numberOfLabScientists: {
      type: Number,
      default: 0,
    },
    healthRecordAndHIMOfficers: {
      type: Number,
      default: 0,
    },
    numberOfCommunityHealthWorkers: {
      type: Number,
      default: 0,
    },
    numberOfCommunityHealthExtensionWorker: {
      type: Number,
      default: 0,
    },
    numberOfJuniorComHealthExtensionWorker: {
      type: Number,
      default: 0,
    },
    numberOfEnvironmentalHealthOfficers: {
      type: Number,
      default: 0,
    },
    numberOfHealthAttendantOrAssistant: {
      type: Number,
      default: 0,
    },
    // practiioner: String, virtual populate
    organization: {
      ref: 'Organization',
      type: mongoose.Schema.ObjectId,
      unique: [true, 'Organization Personnel already exist.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

_personnelSchema.virtual('practitioners', {
  ref: 'Practitioner',
  localField: '_id',
  foreignField: '_personnel',
});

const _Personnel = mongoose.model('_Personnel', _personnelSchema);
module.exports = _Personnel;
