const mongoose = require('mongoose');
const Qualification = require('./qualification_schema');
const HumanName = require('../../human_name_schema');
const Address = require('../../address_model');
const Telecom = require('../../telecom_schema');
const Identifier = require('../../identifier_model');

const practitionerSchema = new mongoose.Schema(
  {
    identifier: [Identifier],
    active: {
      type: Boolean,
    },
    name: HumanName,
    address: [Address],
    telecom: [Telecom],
    gender: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    photo: {
      type: String,
    },
    qualification: [Qualification],
    communication: [String],
    _personnel: {
      type: mongoose.Schema.ObjectId,
      ref: '_Personnel',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Practitioner = mongoose.model('Practitioner', practitionerSchema);
module.exports = Practitioner;
