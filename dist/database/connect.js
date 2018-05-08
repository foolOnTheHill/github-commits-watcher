'use strict';

var mongoose = require('mongoose');
var config = require('../config/config');

var mongoDB = process.env.MONGODB_URI || config.MONGODB_URI;

module.exports = function () {
	mongoose.connect(mongoDB);
	mongoose.Promise = global.Promise;
	mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
};