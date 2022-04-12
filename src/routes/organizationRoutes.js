const express = require('express');

const {
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
  getOrganization,
  getMe,
} = require('../controller/organizationController');
// const _serviceRouter = require('./_serviceRoutes');
const addressRouter = require('./addressRoutes');
const telecomRouter = require('./telecomRoutes');
const identifierRouter = require('./identifierRoutes');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/login').post(authController.login);

// router.use('/:orgId/_service', _serviceRouter);
router.use('/:id/address', addressRouter);
router.use('/:id/telecom', telecomRouter);
router.use('/:id/identifier', identifierRouter);

router.get('/me', authController.protect, getMe, getOrganization);

router
  .route('/')
  .post(authController.createOrganization)
  .patch(authController.protect, updateOrganization)
  .get(authController.protect, getAllOrganizations);

router.use(authController.protect);
router.route('/:id').get(getOrganization).delete(deleteOrganization);

module.exports = router;
