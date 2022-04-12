const Organization = require('../models/organization_model');

exports.updateOrg = async (org_id, new_id, name) => {
  const body = {};
  body[name] = new_id;
  await Organization.findByIdAndUpdate(org_id, body);
};
