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

humanNameSchema.pre('save', function (next) {
  this.text = `${this.prefix[0]} ${this.family} ${this.given[0]}`;
  next();
});

module.exports = humanNameSchema;
