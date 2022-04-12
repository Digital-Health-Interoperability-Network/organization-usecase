const express = require('express');
const {
  create_Service,
  // getAll_Services,
  update_Service,
  get_Service,
} = require('../controller/_servicesController');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/').post(create_Service).get(get_Service).patch(update_Service);

module.exports = router;
