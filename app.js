const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');

const logger = require('morgan');

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const hookRouter = require('./routes/hook');

const app = express();

app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cors({origin: true}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '/build')));

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/hook', hookRouter);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/build', 'index.html'));
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
