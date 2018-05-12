'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var express = require('express');
var router = express.Router();

var errors = require('restify-errors');

var jwt = require('../utils/jwt');

var api = require('../utils/github-api');

var create = require('../database/dal/create');
var find = require('../database/dal/find');

var sortCommits = require('../utils/sortCommits');

router.get('/commits', function (req, res, next) {
	var token_param = req.query.token;

	if (!token_param) {
		next(new errors.BadRequestError('Missing token'));
	}

	jwt.verify(token_param).then(function (token) {
		var login = token.login;

		find.findUserCommits(login).then(function (commits) {
			return sortCommits(commits);
		}).then(function (commits) {
			res.send(commits);
		}).catch(function (err) {
			console.error(err);
			next(new errors.InternalServerError(err));
		});
	}).catch(function (err) {
		console.error(err);
		next(new errors.UnauthorizedError(err));
	});
});

router.post('/repositories', function (req, res, next) {
	var token_param = req.body.token;


	if (!token_param) {
		next(new errors.BadRequestError('Missing token'));
	}

	jwt.verify(token_param).then(function (token) {
		var login = token.login;

		var _req$body = req.body,
		    owner = _req$body.owner,
		    repository = _req$body.repository;


		if (!owner) {
			next(new errors.BadRequestError('Missing repository owner'));
		}
		if (!repository) {
			next(new errors.BadRequestError('Missing repository name'));
		}

		var access_token = token.access_token;

		return find.checkRepositoryExists(login, repository).then(function (exists) {
			if (exists) {
				res.status(200).end();
				return;
			} else {
				return Promise.all([api.getRepoInfo(access_token, owner, repository), api.getRepoLastMonthCommits(access_token, owner, repository)]).then(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    repoInfo = _ref2[0],
					    commits = _ref2[1];

					var description = repoInfo.description,
					    created_date = repoInfo.created_date;


					return create.newRepository(login, repository, description, created_date).then(function () {
						return Promise.all(commits.map(function (commit) {
							return create.newCommit(login, repository, commit.date, commit.message, commit.author, commit.hash);
						}));
					});
				}).then(function () {
					return api.createHook(access_token, owner, repository);
				}).then(function () {
					res.status(200).end();
				}).catch(function (error) {
					console.error(error);
					next(new errors.InternalServerError(error));
				});
			}
		});
	}).catch(function (error) {
		console.error(error);
		next(new errors.UnauthorizedError(error));
	});
});

router.get('/repositories/:repository/commits', function (req, res, next) {
	var token_param = req.query.token;

	if (!token_param) {
		next(new errors.BadRequestError('Missing token'));
	}

	jwt.verify(token_param).then(function (token) {
		var owner = token.login;
		var repository = req.params.repository;

		find.findRepositoryCommits(owner, repository).then(function (commits) {
			return sortCommits(commits);
		}).then(function (commits) {
			res.send(commits);
		}).catch(function (err) {
			console.error(err);
			next(new errors.InternalServerError(err));
		});
	}).catch(function (err) {
		console.error(err);
		next(new errors.UnauthorizedError(err));
	});
});

router.get('/repositories', function (req, res, next) {
	var token_param = req.query.token;

	if (!token_param) {
		next(new errors.BadRequestError('Missing token'));
	}

	jwt.verify(token_param).then(function (token) {
		var user = token.login;

		find.findUserRepositories(user).then(function (repos) {
			res.send(repos);
		}).catch(function (err) {
			next(new errors.InternalServerError(err));
		});
	}).catch(function (err) {
		console.error(err);
		next(new errors.UnauthorizedError(err));
	});
});

module.exports = router;