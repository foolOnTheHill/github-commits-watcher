const errors = require('restify-errors');

const User = require('../models/user');
const Repository = require('../models/repository');
const Commit = require('../models/commit');

const findOneUser = (params) => {
	return new Promise((resolve, reject) => {
		User.findOne({login: params}).exec((err, user) => {
			if (err) { reject(err); }

			if (!user) { throw new errors.UnauthorizedError('Current user not found'); }

			resolve(user);
		});
	});
};

const findAllRepositories = (params) => {
	return new Promise((resolve, reject) => {
		Repository.find(params).exec((err, repositories) => {
			if (err) { reject(err); }

			repositories = repositories || [];

			resolve(repositories);
		});
	});
};

const findOneRepository = (params) => {
	return new Promise((resolve, reject) => {
		Repository.findOne(params).exec((err, repositories) => {
			if (err) { reject(err); }

			resolve(repositories);
		});
	});
};

const findAllCommits = (params) => {
	return new Promise((resolve, reject) => {
		Commit.find(params).exec((err, commits) => {
			if (err) { reject(err); }

			commits = commits || [];

			resolve(commits);
		});
	});
};

const findUserRepositories = (login) => {
	return findOneUser(login).then(user => {
		return findAllRepositories({owner: user._id});
	});
};

const findRepositoryCommits = (login, repo) => {
	return findOneUser(login).then(user => {
		return findOneRepository({owner: user._id, name: repo});
	}).then(repository => {
		return findAllCommits({repository: repository._id});
	});
};

const findUserCommits = (login) => {
	return findOneUser(login).then(user => {
		return findAllRepositories({owner: user._id});
	}).then(repositories => {
		return Promise.all(repositories.map(repo => {
			return findAllCommits({repository: repo._id});
		}));
	});
};

module.exports = {
	findOneUser,
	findUserRepositories,
	findUserCommits,
	findRepositoryCommits
};
