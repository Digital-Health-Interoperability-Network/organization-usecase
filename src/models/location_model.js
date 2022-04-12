const mongoose = require('mongoose');
const Address = require('./address_model');
const Telecom = require('./telecom_schema');
const Identifier = require('./identifier_model');

const locationSchema = new mongoose.Schema({
  identifier: [Identifier],
  status: {
    type: String,
  },
  operationalStatus: {
    type: String,
  },
  mode: String,
  name: {
    type: String,
  },
  alias: {
    type: [String],
  },
  type: [Object],
  description: {
    type: String,
  },
  telecom: [Telecom],
  address: [Address],
  physicalType: {
    type: Map,
    of: [Object],
  },
  position: {
    type: Map,
    of: Number,
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
  },
  partOf: String,
  hoursOfOperation: String,
  availaibilityException: String,
  endpoint: [Object],
  healthcareService: {
    type: mongoose.Schema.ObjectId,
    ref: 'HealthcareService',
  },
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
