'use strict';

var express = require('express');
var router = express.Router();

var errors = require('restify-errors');

var create = require('../database/dal/create');

router.post('/', function (req, res, next) {
	var payload = req.body;

	var repository = payload.repository,
	    commits = payload.commits;


	var owner = repository.owner.name;
	var repo_name = repository.name;

	return Promise.all(commits.map(function (commit) {

		var dto = {
			date: commit.author.date,
			message: commit.message,
			author: commit.author.name + ' (' + commit.author.email + ')',
			hash: ''
		};

		return create.newCommit(owner, repo_name, dto.date, dto.message, dto.author, dto.hash);
	})).then(function () {
		res.status(200).send();
	}).catch(function (error) {
		console.error(error);
		next(new errors.InternalServerError(error));
	});
});

module.exports = router;