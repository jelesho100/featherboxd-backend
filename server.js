const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const sightingsRouter = require('./controllers/sightings.js');
const likesRouter = require('./controllers/likes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const PORT = process.env.PORT ? process.env.PORT : 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/sightings', sightingsRouter);
app.use('/likes', likesRouter);


// Start the server and listen on port 3000
app.listen(PORT, () => {
  console.log('The express app is ready!');
});
