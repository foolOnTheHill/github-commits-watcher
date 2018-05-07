const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const cookieChecker = require('./middleware/cookie-checker');
const sessionChecker = require('./middleware/session-checker');

const logger = require('morgan');

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));

app.use(cors({origin: true}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(session({
	key: 'token',
	secret: 'my_secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: new Date(Date.now() + 60 * 60 * 1000)
	}
}));

app.use(cookieChecker);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/build')));

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.get('/app', (req, res) => {
	res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

// catchall handler
app.get('*', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.statusCode || 500);
	res.send(err.message || 'Internal Server Error');
});

module.exports = app;
