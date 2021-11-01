var express = require('express');
var path = require('path');
var logger = require('morgan');

var toDoRouter = require('./routes/todoRouter');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/todo', toDoRouter);

module.exports = app;
