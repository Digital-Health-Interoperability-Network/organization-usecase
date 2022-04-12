const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  use: {
    type: String,
  },
  type: {
    type: String,
  },
  text: {
    type: String,
  },
  line: {
    type: [String],
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  period: {
    startDate: String,
    endDate: String,
  },
  // organization: {
  //   ref: 'Organization',
  //   type: mongoose.Schema.ObjectId,
  // },
});

module.exports = addressSchema;
