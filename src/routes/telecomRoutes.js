const express = require('express');
const { protect } = require('../controller/authController');

const {
  createTelecom,
  updateTelecom,
  deleteTelecom,
} = require('../controller/telecomController');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createTelecom);
router
  .route('/:id1')
  .patch(protect, updateTelecom)
  .delete(protect, deleteTelecom);
module.exports = router;
