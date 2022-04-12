const express = require('express');
const locationRouter = require('./locationRoutes');
const {
  createHealthcareService,
  getAllHealthcareService,
  updateHealthcareService,
} = require('../controller/healthcareServiceController');
const telecomRouter = require('./telecomRoutes');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use('/:id/location', locationRouter);
router.use('/:id/telecom', telecomRouter);

router.use(protect);
router.route('/').post(createHealthcareService).get(getAllHealthcareService);
router.route('/id').patch(updateHealthcareService);

module.exports = router;
