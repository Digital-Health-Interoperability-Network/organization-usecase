const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const randomstring = require('randomstring');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address.'],
    required: [true, 'Email is required.'],
  },
  confirmationCode: String,
  confirmationCodeExpires: Date,
});

userSchema.methods.createConfirmationToken = function () {
  const otp = randomstring.generate({
    length: 4,
    charset: 'numeric',
  });

  this.confirmationCode = crypto.createHash('sha256').update(otp).digest('hex');

  this.confirmationCodeExpires = Date.now() + 2 * 60 * 1000;
  return otp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
