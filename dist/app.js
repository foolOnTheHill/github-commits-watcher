'use strict';

var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');

var bodyParser = require('body-parser');

var logger = require('morgan');

var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');
var hookRouter = require('./routes/hook');

var app = express();

app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/build')));

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/hook', hookRouter);

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.statusCode || 500);
	res.send(err.message || 'Internal Server Error');
});

module.exports = app;