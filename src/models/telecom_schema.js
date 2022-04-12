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
    unique: true,
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
  },
});

module.exports = telecomSchema;
