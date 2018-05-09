const express = require('express');
const router = express.Router();

const errors = require('restify-errors');

const create = require('../database/dal/create');

router.post('/', (req, res, next) => {
	const payload = req.body;

	let { repository, commits } = payload;

	const owner = repository.owner.name;
	const repo_name = repository.name;

	return Promise.all(commits.map(commit => {

		const dto = {
			date: commit.author.date,
			message: commit.message,
			author: `${commit.author.name} (${commit.author.email})`,
			hash: ''
		};

		return create.newCommit(owner, repo_name, dto.date, dto.message, dto.author, dto.hash);
	})).then(() => {
		res.status(200).send();
	}).catch(error => {
		console.error(error);
		next(new errors.InternalServerError(error));
	});
});

module.exports = router;
