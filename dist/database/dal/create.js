'use strict';

var User = require('../models/user');
var Repository = require('../models/repository');
var Commit = require('../models/commit');

var newUser = function newUser(login, avatar_url, email, name) {
	return new Promise(function (resolve, reject) {
		var user = new User({
			login: login, avatar_url: avatar_url, email: email, name: name
		});

		user.save(function (err) {
			if (err) {
				reject(err);
			}
			resolve(user);
		});
	});
};

var newCommit = function newCommit(login, repository, date, message, author, hash) {
	return new Promise(function (resolve, reject) {
		User.findOne({ login: login }).exec(function (err, user) {
			if (err) {
				reject(err);
			}

			Repository.findOne({ owner: user._id, name: repository }).exec(function (err, repository) {
				if (err) {
					reject();
				}

				var commit = new Commit({
					repository: repository._id,
					date: date,
					message: message,
					author: author,
					hash: hash
				});

				commit.save(function (err) {
					if (err) {
						reject();
					}

					resolve(commit);
				});
			});
		});
	});
};

var newRepository = function newRepository(login, name, description, created_date) {
	return new Promise(function (resolve, reject) {
		User.findOne({ login: login }).exec(function (err, user) {
			if (err) {
				reject();
			}

			var repo = new Repository({
				owner: user._id,
				name: name,
				description: description,
				created_date: created_date
			});

			repo.save(function (err) {
				if (err) {
					reject();
				}

				resolve(repo);
			});
		});
	});
};

module.exports = {
	newUser: newUser,
	newRepository: newRepository,
	newCommit: newCommit
};