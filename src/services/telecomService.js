/* eslint-disable eqeqeq */
const AppError = require('../utils/appError');

exports.createData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.telecom.push(body);
  await data.save();
  return await data;
};

exports.updateData = async (doc, id, value, next) => {
  const data = doc;
  const telecom = data.telecom.find((e) => e._id == id);
  if (!telecom) return next(new AppError('telecom id not found', 404));
  telecom.value = value;
  await data.save();
  return await data;
};

exports.deleteData = async (Model, docId, telecomIid) =>
  await Model.findOneAndUpdate(
    { _id: docId },
    { $pull: { telecom: { _id: telecomIid } } },
    { new: true }
  );

exports.practitionerVerification = async (
  Model,
  practitionerId,
  orgPersonelId,
  next
) => {
  //practitioner
  //1) verify that the practitioner exists
  const practitioner = await Model.findById(practitionerId);
  if (!practitioner) {
    return next(new AppError(`No Practitioner with that id`, 404));
  }
  //2) Verify that the organization is the owner of this practitioner
  if (practitioner._personnel !== orgPersonelId) {
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  }
  return practitioner;
};
exports.organizationVerification = async (docId, orgMeId, next) => {
  //1) Verify that the organization is the owner of this practitioner
  if (docId !== orgMeId) {
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  }
};
exports.contactVerification = async (Model, contactId, orgId, next) => {
  //1) verify that the practitioner exists
  const contact = await Model.findById(contactId);
  if (!contact) {
    return next(new AppError(`No Contact with that id`, 404));
  }
  //2) Verify that the organization is the owner of this practitioner
  if (`${contact.organization}` !== `${orgId}`) {
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  }
  return contact;
};
exports.locationVerification = async () => {};
exports.healthcareServiceVerification = async (
  Model,
  docId,
  orgServId,
  next
) => {
  //1) verify that the practitioner exists
  const healthcareService = await Model.findById(docId);
  if (!healthcareService) {
    return next(new AppError(`No Contact with that id`, 404));
  }
  //2) Verify that the organization is the owner of this practitioner
  if (healthcareService._service !== orgServId) {
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  }
  return healthcareService;
};
