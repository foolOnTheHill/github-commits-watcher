const jwt = require('jsonwebtoken');
const errors = require('restify-errors');

const config = require('../config/config');

const sign = (data) => {
	return jwt.sign(data, config.JWT_SECRET, {
		expiresIn: 60 * 60 * 24 // expires in 24 hours
	});
};

const verify = (token) => {
	return jwt.verify(token, config.JWT_SECRET, (err, data) => {
		if (err) { throw new errors.UnauthorizedError('Invalid token'); }
		return data;
	});
};

module.exports = {
	sign,
	verify
};
