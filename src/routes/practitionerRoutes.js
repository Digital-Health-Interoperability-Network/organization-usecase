const express = require('express');
const {
  create_Practitioner,
  getPractitoner,
  getAllMyPractitioners,
  updatePractitioner,
  deletePractitioner,
} = require('../controller/practitionerController');
const { protect } = require('../controller/authController');
const practitioneroleRouter = require('./practitionerRoleRoutes');
const identifierRouter = require('./identifierRoutes');

const router = express.Router({ mergeParams: true });
router.use('/:id/practitionerrole', practitioneroleRouter);
router.use('/:id/identifier', identifierRouter);

router.use(protect);
router.route('/').post(create_Practitioner).get(getAllMyPractitioners);
router
  .route('/:id')
  .patch(updatePractitioner)
  .get(getPractitoner)
  .delete(deletePractitioner);

module.exports = router;
