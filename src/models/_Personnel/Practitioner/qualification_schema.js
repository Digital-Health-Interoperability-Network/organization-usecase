const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
  identifier: [
    {
      system: String,
      value: String,
    },
  ],
  code: {
    type: Object,
  },
  period: {
    startDate: String,
    endDate: String,
  },
  issuer: {
    type: String,
  },
});

module.exports = qualificationSchema;
