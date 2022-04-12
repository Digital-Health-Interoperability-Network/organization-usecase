const express = require('express');

const {
  createHumanName,
  getAllHumanName,
  updateHumanName,
  getHumanName,
} = require('../controller/humanNameController');

const router = express.Router();

// router.route('/').post(createHumanName).get(getAllHumanName);
// router.route('/:id').patch(updateHumanName).get(getHumanName);

module.exports = router;
