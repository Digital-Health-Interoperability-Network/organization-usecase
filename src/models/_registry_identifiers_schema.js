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
  alias: {
    type: String,
  },
  startDate: Date,
  EndDate: Date,
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
    type: String,
  },
  registrationStatus: {
    type: String,
  },
  licenseStatus: {
    type: String,
  },
});

module.exports = _registryIdentifierSchema;
