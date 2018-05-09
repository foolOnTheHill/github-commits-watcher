const express = require('express');
const router = express.Router();

const errors = require('restify-errors');

const jwt = require('../utils/jwt');

const api = require('../utils/github-api');

const create = require('../database/dal/create');
const find = require('../database/dal/find');

router.get('/commits', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	jwt.verify(token_param).then(token => {
		const login = token.login;

		find.findUserCommits(login).then(commits => {
			res.send(commits);
		}).catch(err => {
			next(new errors.InternalServerError(err));
		});
	}).catch(err => {
		next(new errors.UnauthorizedError(err));
	});
});

router.post('/repositories', (req, res, next) => {
	let { token : token_param } = req.body;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	jwt.verify(token_param).then(token => {
		const login = token.login;

		let { owner, repository } = req.body;

		if (!owner) { next(new errors.BadRequestError('Missing repository owner')); }
		if (!repository) { next(new errors.BadRequestError('Missing repository name')); }

		const access_token = token.access_token;

		return find.checkRepositoryExists(login, repository).then(exists => {
			if (exists) {
				res.status(200).end();
				return;
			} else {
				return Promise.all([
					api.getRepoInfo(access_token, owner, repository),
					api.getRepoLastMonthCommits(access_token, owner, repository)
				]).then(([repoInfo, commits]) => {
					let {description, created_date} = repoInfo;

					return create.newRepository(login, repository, description, created_date).then(() => {
						return Promise.all(commits.map(commit => {
							return create.newCommit(login, repository, commit.date, commit.message, commit.author, commit.hash);
						}));
					});
				}).then(() => {
					res.status(200).end();
				}).catch(error => {
					console.error(error);
					next(new errors.InternalServerError(error));
				});
			}
		});
	}).catch(error => {
		console.error(error);
		next(new errors.UnauthorizedError(error));
	});
});

router.get('/repositories/:repository/commits', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	jwt.verify(token_param).then(token => {
		const owner = token.login;
		const repository = req.params.repository;

		find.findRepositoryCommits(owner, repository).then(commits => {
			res.send(commits);
		}).catch(err => {
			next(new errors.InternalServerError(err));
		});
	}).catch(err => {
		next(new errors.UnauthorizedError(err));
	});
});

router.get('/repositories', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	jwt.verify(token_param).then(token => {
		const user = token.login;

		find.findUserRepositories(user).then(repos => {
			res.send(repos);
		}).catch(err => {
			next(new errors.InternalServerError(err));
		});
	}).catch(err => {
		next(new errors.UnauthorizedError(err));
	});
});

module.exports = router;
