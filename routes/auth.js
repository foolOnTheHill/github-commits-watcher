const express = require('express');
const router = express.Router();

const errors = require('restify-errors');

const request = require('request-promise');

const api = require('../utils/github-api');

const jwt = require('../utils/jwt');

const create = require('../database/dal/create');
const update = require('../database/dal/update');
const find = require('../database/dal/find');

const config = require('../config/config');

const githubOAuth = require('github-oauth')({
	githubClient: config.GITHUB_KEY,
	githubSecret: config.GITHUB_SECRET,
	baseURL: 'http://localhost:8080', // 'https://morning-shelf-22723.herokuapp.com',
	loginURI: '/authenticate',
	callbackURI: '/login/redirect'
});

router.get('/', (req, res) => {
	return githubOAuth.login(req, res);
});

router.post('/', (req, res) => {
	let { code, state } = req.body;

	request({
		method: 'POST',
		uri: 'https://github.com/login/oauth/access_token',
		body: {
			client_id: config.GITHUB_KEY,
			client_secret: config.GITHUB_SECRET,
			code: code,
			state: state
		},
		headers: {
			'Accept': 'application/json'
		},
		json: true
	}).then(result => {

		const access_token = result.access_token;

		api.getUserProfile(access_token).then(profile => {

			let { login, avatar_url, email, name } = profile;

			find.findOneUser(login).then(user => {
				if (user) {
					return update.updateUserProfile(user._id, profile);
				} else {
					return create.newUser(login, avatar_url, email, name);
				}
			}).then(() => {
				const oauth = jwt.sign({
					access_token,
					login,
					avatar_url,
					email,
					name
				});

				const token = {
					user: profile,
					token: oauth
				};

				res.send(token);
			});
		});
	}).catch(error => {
		throw new errors.UnauthorizedError(error);
	});
});

module.exports = router;
