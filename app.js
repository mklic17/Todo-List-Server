var express = require('express');
var path = require('path');
var logger = require('morgan');

// Load Environment variables if not Production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Create MongoDB connection
require('./models/setupMongo')();

// Routes defind and imported
var toDoRouter = require('./routes/todoRouter');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/userRouter');

// initialize Express
var app = express();

// Middleware defined
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Endpoints for Routes
app.use('/todo', toDoRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

module.exports = app;