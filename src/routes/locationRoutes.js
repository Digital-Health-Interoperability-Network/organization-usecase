const express = require('express');

const {
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controller/locationController');
const addressRouter = require('./addressRoutes');
const identifierRouter = require('./identifierRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:id/address', addressRouter);
router.use('/:id/identifier', identifierRouter);

router.route('/').post(createLocation);
router.route('/:id1').patch(updateLocation).delete(deleteLocation);

module.exports = router;
