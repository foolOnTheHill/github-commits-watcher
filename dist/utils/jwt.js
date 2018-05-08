'use strict';

var jwt = require('jsonwebtoken');
var errors = require('restify-errors');

var config = require('../config/config');

var sign = function sign(data) {
	return jwt.sign(data, config.JWT_SECRET, {
		expiresIn: 60 * 60 * 24 // expires in 24 hours
	});
};

var verify = function verify(token) {
	return new Promise(function (resolve, reject) {
		jwt.verify(token, config.JWT_SECRET, function (err, data) {
			if (err) {
				reject(new errors.UnauthorizedError('Invalid token'));
			}
			resolve(data);
		});
	});
};

module.exports = {
	sign: sign,
	verify: verify
};