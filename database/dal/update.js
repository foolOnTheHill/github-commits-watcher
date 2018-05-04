const User = require('../models/user');

const updateUserProfile = (id, profile) => {
	return new Promise((resolve, reject) => {
		User.findOne({_id: id}).exec((err, user) => {
			if (err) {
				reject(err);
			}

			user.set(profile);

			user.save((err) => {
				if (err) {
					reject(err);
				}

				resolve();
			});
		});
	});
};

module.exports = {
	updateUserProfile
};
