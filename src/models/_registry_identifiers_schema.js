const mongoose = require('mongoose');

const _registryIdentifierSchema = new mongoose.Schema({
  facilityCode: {
    type: String,
  },
  stateUID: {
    type: String,
  },
  registrationNO: {
    String,
  },
  facilityName: {
    type: String,
  },
  startDate: String,
  EndDate: String,
  ownership: {
    type: String,
  },
  ownershipType: {
    type: String,
  },
  facilityLevel: {
    type: String,
  },
  daysOfOperation: {
    type: [String],
  },
  hoursOfOperation: {
    type: Map,
    of: Object,
  },
  operationalStatus: {
    type: Boolean,
    default: true,
  },
  registrationStatus: {
    type: Boolean,
    default: true,
  },
  licenseStatus: {
    type: Boolean,
    default: true,
  },
});

module.exports = _registryIdentifierSchema;
