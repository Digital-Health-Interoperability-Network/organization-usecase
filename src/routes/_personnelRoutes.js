const express = require('express');
const {
  create_Personnel,
  get_Personnel,
  get_MyPersonnel,
} = require('../controller/_personnelController');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/').post(create_Personnel).get(get_MyPersonnel);
router.route('/:id').get(get_Personnel);
// .patch(update_Service)

module.exports = router;
