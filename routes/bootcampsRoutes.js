const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getSingleBootcamp,
  getBootcampInRadius,
} = require('../controllers/bootcampsControllers');

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
