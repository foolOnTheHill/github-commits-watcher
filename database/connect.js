const mongoose = require('mongoose');
const config = require('../config/config');

const mongoDB = process.env.MONGODB_URI || config.MONGODB_URI;

module.exports = () => {
	mongoose.connect(mongoDB);
	mongoose.Promise = global.Promise;
	mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
