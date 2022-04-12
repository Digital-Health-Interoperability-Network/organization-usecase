const express = require('express');
const {
  createAddress,
  // getAllAddresses,
  deleteAddress,
  updateAddress,
} = require('../controller/addressController');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/').post(createAddress).put(updateAddress);
router.route('/:id1').delete(deleteAddress);
module.exports = router;

module.exports = router;
