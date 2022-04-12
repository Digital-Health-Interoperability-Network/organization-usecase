const mongoose = require('mongoose');
// const validator = require('validator');

const humanNameSchema = new mongoose.Schema({
  use: String,
  text: {
    type: String,
  },
  family: {
    type: String,
    required: [true, 'Family name is requires'],
  },
  given: {
    type: [String],
  },
  prefix: {
    type: [String],
  },
  suffix: {
    type: [String],
  },
  period: {
    startDate: String,
    endDate: String,
  },
});

module.exports = humanNameSchema;
