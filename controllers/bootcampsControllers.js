const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const catchAsync = require('../utils/catchAsync');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = catchAsync(async (req, res, next) => {
  let query;
  console.log(req.query);
  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;

  res.status(200).json({
    result: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getSingleBootcamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  res.json({ data: bootcamp });
});

// @desc    Create bootcamp
// @route   POST/api/v1/bootcamps
// @access  Private
exports.createBootcamp = catchAsync(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT/api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = catchAsync(async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.json({ data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE/api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = catchAsync(async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  res.json({ data: 'Bootcamp was deleted' });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zepcode/:distance
// @access  Private
exports.getBootcampInRadius = catchAsync(async (req, res) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  console.log(loc);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide distance by radius of earth
  //Earth radius = 3,963 mi
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.json({
    success: true,
    result: bootcamps.length,
    data: bootcamps,
  });
});
