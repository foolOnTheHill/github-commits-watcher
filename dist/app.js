'use strict';

var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');

var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var cookieChecker = require('./middleware/cookie-checker');

var logger = require('morgan');

var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');

var app = express();

app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
	key: 'token',
	secret: 'my_secret',
	resave: true,
	saveUninitialized: false,
	cookie: {
		expires: new Date(Date.now() + 60 * 60 * 1000)
	}
}));

app.use(cookieChecker);

app.use(express.static(path.join(__dirname, '/build')));

app.use('/api', apiRouter);
app.use('/auth', authRouter);

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