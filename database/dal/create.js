const User = require('../models/user');
const Repository = require('../models/repository');
const Commit = require('../models/commit');

const newUser = (login, avatar_url, email, name) => {
	return new Promise((resolve, reject) => {
		const user = new User({
			login, avatar_url, email, name
		});

		user.save((err) => {
			if (err) { reject(err); }
			resolve(user);
		});
	});
};

const newCommit = (login, repository, date, message, author, hash) => {
	return new Promise((resolve, reject) => {
		User.findOne({login : login}).exec((err, user) => {
			if (err) { reject(err); }

			Repository.findOne({owner: user._id, name: repository}).exec((err, repository) => {
				if (err) { reject(); }

				const commit = new Commit({
					repository: repository._id,
					date,
					message,
					author,
					hash
				});

				commit.save((err) => {
					if (err) { reject(); }

					resolve(commit);
				});
			});
		});
	});
};

const newRepository = (login, name, description, created_date) => {
	return new Promise((resolve, reject) => {
		User.findOne({login : login}).exec((err, user) => {
			if (err) { reject(); }

			const repo = new Repository({
				owner: user._id,
				name,
				description,
				created_date
			});

			repo.save((err) => {
				if (err) { reject(); }

				resolve(repo);
			});
		});
	});
};

module.exports = {
	newUser,
	newRepository,
	newCommit
};
