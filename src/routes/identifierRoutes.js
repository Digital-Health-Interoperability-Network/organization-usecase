const express = require('express');

const {
  createIdentifier,
  updateIdentifier,
  deleteIdentifier,
} = require('../controller/identifierController');
const { protect } = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/').post(createIdentifier).put(updateIdentifier);
router.route('/:id1').delete(deleteIdentifier);
module.exports = router;
