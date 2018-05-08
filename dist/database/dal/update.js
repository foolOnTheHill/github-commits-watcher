'use strict';

var User = require('../models/user');

var updateUserProfile = function updateUserProfile(id, profile) {
	return new Promise(function (resolve, reject) {
		User.findOne({ _id: id }).exec(function (err, user) {
			if (err) {
				reject(err);
			}

			user.set(profile);

			user.save(function (err) {
				if (err) {
					reject(err);
				}

				resolve();
			});
		});
	});
};

module.exports = {
	updateUserProfile: updateUserProfile
};