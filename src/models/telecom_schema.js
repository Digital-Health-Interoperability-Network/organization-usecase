const mongoose = require('mongoose');
// const validator = require('validator');

const telecomSchema = new mongoose.Schema({
  use: {
    type: String,
  },
  system: {
    type: String,
  },
  value: {
    type: String,
  },
  rank: {
    type: Number,
  },
  period: {
    type: Map,
    of: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = telecomSchema;
