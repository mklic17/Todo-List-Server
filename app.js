var express = require('express');
var path = require('path');
var logger = require('morgan');

// Load Environment variables if not Production
// if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
// }

// initialize Express
var app = express();

// Create MongoDB connection
require('./models/setupMongo')();


// Routes defind and imported
var toDoRouter = require('./routes/todoRouter');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/userRouter');


// Middleware defined
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Endpoints for Routes
app.use('/todo', toDoRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;