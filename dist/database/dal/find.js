'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var User = require('../models/user');
var Repository = require('../models/repository');
var Commit = require('../models/commit');

var findOneUser = function findOneUser(params) {
	return new Promise(function (resolve, reject) {
		User.findOne({ login: params }).exec(function (err, user) {
			if (err) {
				reject(err);
			}

			resolve(user);
		});
	});
};

var findAllRepositories = function findAllRepositories(params) {
	return new Promise(function (resolve, reject) {
		Repository.find(params).populate('owner').exec(function (err, repositories) {
			if (err) {
				reject(err);
			}

			repositories = repositories || [];

			resolve(repositories);
		});
	});
};

var findOneRepository = function findOneRepository(params) {
	return new Promise(function (resolve, reject) {
		Repository.findOne(params).populate('owner').exec(function (err, repository) {
			if (err) {
				reject(err);
			}

			resolve(repository);
		});
	});
};

var findAllCommits = function findAllCommits(params) {
	return new Promise(function (resolve, reject) {
		Commit.find(params).populate('repository').exec(function (err, commits) {
			if (err) {
				reject(err);
			}

			commits = commits || [];

			resolve(commits);
		});
	});
};

var findUserRepositories = function findUserRepositories(login) {
	return findOneUser(login).then(function (user) {
		return findAllRepositories({ owner: user._id });
	});
};

var findRepositoryCommits = function findRepositoryCommits(login, repo) {
	return findOneUser(login).then(function (user) {
		return findOneRepository({ owner: user._id, name: repo });
	}).then(function (repository) {
		return findAllCommits({ repository: repository._id });
	});
};

var checkRepositoryExists = function checkRepositoryExists(login, repo) {
	return findOneUser(login).then(function (user) {
		return findOneRepository({ owner: user._id, name: repo });
	}).then(function (repository) {
		if (repository) {
			return true;
		} else {
			return false;
		}
	});
};

var findUserCommits = function findUserCommits(login) {
	return findOneUser(login).then(function (user) {
		return findAllRepositories({ owner: user._id });
	}).then(function (repositories) {
		return Promise.all(repositories.map(function (repo) {
			return findAllCommits({ repository: repo._id });
		})).then(function (data) {
			var _ref;

			return (_ref = []).concat.apply(_ref, _toConsumableArray(data));
		});
	});
};

module.exports = {
	findOneUser: findOneUser,
	findUserRepositories: findUserRepositories,
	findUserCommits: findUserCommits,
	findRepositoryCommits: findRepositoryCommits,
	checkRepositoryExists: checkRepositoryExists
};