const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const Identifier = require('./identifier_model');
const Address = require('./address_model');
const Telecom = require('./telecom_schema');
const _RegistryIdentifier = require('./_registry_identifiers_schema');
const _PersonnelModel = require('./_Personnel/_personnel_model');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'please enter a password'],
      minLength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    confirmationCode: String,
    confirmationCodeExpires: Date,
    _service: {
      type: mongoose.Schema.ObjectId,
      ref: '_Service',
    },
    _personnel: {
      type: mongoose.Schema.ObjectId,
      ref: '_Personnel',
    },
    identifier: [Identifier],
    telecom: [Telecom],
    _registryIdentifier: _RegistryIdentifier,
    alias: {
      type: [String],
    },
    type: [
      {
        system: String,
        code: String,
        display: String,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    address: [Address],
    partOf: {
      type: String,
      default: '**PartOf',
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual populate for the contact infomation
organizationSchema.virtual('contact', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'organization',
});

//encrypt password
organizationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

organizationSchema.pre('save', async function (next) {
  if (!this._personnel) {
    const _personnelNew = await _PersonnelModel.create({
      organization: this.id.toString(),
    });
    this._personnel = _personnelNew.id;
  }
});

//function to compare password
organizationSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//get the current timestamp of when the password was changed
organizationSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//password changed after
organizationSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means not changed
  return false;
};

//Organization deleted account
// organizationSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

organizationSchema.methods.createConfirmationToken = function () {
  const otp = randomstring.generate({
    length: 4,
    charset: 'numeric',
  });

  this.confirmationCode = crypto.createHash('sha256').update(otp).digest('hex');

  this.confirmationCodeExpires = Date.now() + 2 * 60 * 5000;
  return otp;
};

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
