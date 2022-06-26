const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorMiddleware = require('./middleware/errorMiddleware');
const ErrorResponse = require('./utils/ErrorResponse');
const bootcampsRoutes = require('./routes/bootcampsRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

//coneect DB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/users', usersRoutes);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
//Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red.underline.bold);
  server.close(() => process.exit(1));
});
