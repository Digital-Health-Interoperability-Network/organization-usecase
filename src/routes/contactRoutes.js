const express = require('express');

const { createContact } = require('../controller/contactController');
const telecomRouter = require('./telecomRoutes');
const addressRouter = require('./addressRoutes');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use('/:id/telecom', telecomRouter);
router.use('/:id/address', addressRouter);

//this is the id of the organization
router.route('/').post(protect, createContact);

module.exports = router;
