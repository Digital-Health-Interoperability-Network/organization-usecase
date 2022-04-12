const mongoose = require('mongoose');
const Telecom = require('./telecom_schema');
const Address = require('./address_model');
const HumanName = require('./human_name_schema');

const contactSchema = new mongoose.Schema({
  purpose: {
    type: String,
    enum: ['BILL', 'ADMIN', 'PAYOR', 'PANTIF', 'PRESS'],
  },
  name: HumanName,
  telecom: [Telecom],
  address: Address,
  period: {
    type: Map,
    of: String,
  },
  organization: {
    ref: 'Organization',
    type: mongoose.Schema.ObjectId,
  },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
