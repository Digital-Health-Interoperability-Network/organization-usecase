const mongoose = require('mongoose');

const identifierSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    use: {
      type: String,
    },
    system: {
      type: String,
    },
    value: {
      type: String,
    },
    assigner: {
      type: String,
    },
    partOf: {
      type: String,
    },
    period: {
      startDate: String,
      endDate: String,
    },
    // organization: {
    //   ref: 'Organization',
    //   type: mongoose.Schema.ObjectId,
    //   required: [true, 'Link to organization is required'],
    // },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = identifierSchema;
