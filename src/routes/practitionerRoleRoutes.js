const express = require('express');
const {
  createPractitionerRole,
  // getAllPractitionerRole,
  getPractitionerRole,
  updatePractitionerRole,
} = require('../controller/practitionerRoleController');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .post(createPractitionerRole)
  .get(getPractitionerRole)
  .patch(updatePractitionerRole);
// router.route('/:id').get(getPractitionerRole);

// router
//   .route('/:id')
//   .patch(update_Service)
//   .get(get_Service)
//   .delete(delete_Service);

module.exports = router;
