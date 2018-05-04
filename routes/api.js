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

	const token = jwt.verify(token_param);
	const login = token.login;

	find.findUserCommits(login).then(commits => {
		res.send(commits);
	}).catch(err => {
		next(new errors.InternalServerError(err));
	});
});

router.post('/repositories', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	const token = jwt.verify(token_param);

	const login = token.login;

	let { owner, repository } = req.body;

	if (!owner) { next(new errors.BadRequestError('Missing repository owner')); }
	if (!repository) { next(new errors.BadRequestError('Missing repository name')); }

	return Promise.all([
		api.getRepoInfo(token, owner, repository),
		api.getRepoLastMonthCommits(token, owner, repository)
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
});

router.get('/repositories/:repository/commits', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	const token = jwt.verify(token_param);

	const owner = token.login;
	const repository = req.params.repository;

	find.findRepositoryCommits(owner, repository).then(commits => {
		res.send(commits);
	}).catch(err => {
		next(new errors.InternalServerError(err));
	});
});

router.get('/repositories', (req, res, next) => {
	const token_param = req.query.token;

	if (!token_param) { next(new errors.BadRequestError('Missing token')); }

	const token = jwt.verify(token_param);

	const user = token.login;

	find.findUserRepositories(user).then(repos => {
		res.send(repos);
	}).catch(err => {
		next(new errors.InternalServerError(err));
	});

});

module.exports = router;
