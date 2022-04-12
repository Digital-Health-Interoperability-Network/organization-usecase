const mongoose = require('mongoose');
const Identifier = require('../../identifier_model');
const _Personnel = require('../_personnel_model');
const Organization = require('../../organization_model');

const Period = {
  startTime: Date,
  endTime: Date,
};

const practitionerRoleSchema = new mongoose.Schema({
  identifier: [Identifier],
  active: Boolean,
  period: Period,
  practitioner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Practitioner',
    required: [true, 'Please enter the practitioner for this role'],
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: '"Organization',
    required: [true, 'Please enter the organization'],
  },
  code: {
    type: [String],
    enum: [
      'Doctor',
      'Pharmacist',
      'Pharmacy Technician',
      'Dentist',
      'Dental Technician',
      'Nurse',
      'Midwife',
      'Lab Technician',
      'Lab Scientist',
      'health Record And HIM Officer',
      'Community Health Worker',
      'Community Health Extension Worker',
      'Junior Commmunity Health Extension Worker',
      'Environmental Health Officers',
      'Health Attendant Or Assistant',
    ],
  },
  specialty: [String],
  availableTime: [
    {
      daysOfWeek: {
        type: ['String'],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      allDay: Boolean,
      availableStartTime: String,
      availableEndTime: String,
    },
  ],
  notAvailable: [
    {
      description: String,
      during: Period,
    },
  ],
});

practitionerRoleSchema.statics.updatePersonnel = async function (
  organizationId,
  _personnelId
) {
  const stats = await this.aggregate([
    {
      $match: {
        organization: organizationId,
      },
    },
    {
      $unwind: '$code',
    },
    {
      $group: {
        _id: '$code',
        numOfPractitioner: { $sum: 1 },
      },
    },
  ]);

  const data = {};
  // stats.forEach(() => {});
  stats.forEach((e) => {
    switch (e._id) {
      case 'Doctor':
        data.numberOfDoctors = e.numOfPractitioner;
        break;
      case 'Pharmacist':
        data.numberOfPharmacists = e.numOfPractitioner;
        break;
      case 'Pharmacy Technician':
        data.numberOfPharmacyTechnicians = e.numOfPractitioner;
        break;
      case 'Dentist':
        data.numberOfDentists = e.numOfPractitioner;
        break;
      case 'Dental Technician':
        data.numberOfDentalTechnicians = e.numOfPractitioner;
        break;
      case 'Nurse':
        data.numberOfNurses = e.numOfPractitioner;
        break;
      case 'Midwife':
        data.numberOfMidwifes = e.numOfPractitioner;
        break;
      case 'Lab Technician':
        data.numberofLabTechnicians = e.numOfPractitioner;
        break;
      case 'Lab Scientist':
        data.numberOfLabScientists = e.numOfPractitioner;
        break;
      case 'Health Record And HIM Officer':
        data.healthRecordAndHIMOfficers = e.numOfPractitioner;
        break;
      case 'Community Health Worker':
        data.numberOfCommunityHealthWorkers = e.numOfPractitioner;
        break;
      case 'Community Health Extension Worker':
        data.numberOfCommunityHealthExtensionWorker = e.numOfPractitioner;
        break;
      case 'Junior Commmunity Health Extension Worker':
        data.numberOfJuniorComHealthExtensionWorker = e.numOfPractitioner;
        break;
      case 'Environmental Health Officers':
        data.numberOfEnvironmentalHealthOfficers = e.numOfPractitioner;
        break;
      case 'Health Attendant Or Assistant':
        data.numberOfHealthAttendantOrAssistant = e.numOfPractitioner;
        break;
      default:
        break;
    }
  });
  await _Personnel.findByIdAndUpdate(_personnelId, data, {
    new: true,
    runValidators: true,
  });
};

practitionerRoleSchema.post('save', async function () {
  // console.log(this);
  const organization = await Organization.findById(this.organization);
  // console.log(x);
  this.constructor.updatePersonnel(this.organization, organization._personnel);
});

practitionerRoleSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

practitionerRoleSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.updateBalance(this.r.account);
});

const PractitionerRole = mongoose.model(
  'PractitionerRole',
  practitionerRoleSchema
);
module.exports = PractitionerRole;
