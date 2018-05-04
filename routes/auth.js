const express = require('express');
const router = express.Router();

const errors = require('restify-errors');

const api = require('../utils/github-api');

const jwt = require('../utils/jwt');

const create = require('../database/dal/create');
const update = require('../database/dal/update');
const find = require('../database/dal/find');

const config = require('../config/config');

const port = process.env.PORT || 8080;

const githubOAuth = require('github-oauth')({
	githubClient: config.GITHUB_KEY,
	githubSecret: config.GITHUB_SECRET,
	baseURL: `http://localhost:${port}`,
	loginURI: '/auth',
	callbackURI: '/auth/redirect'
});

router.get('/', function(req, res) {
	return githubOAuth.login(req, res);
});

router.get('/redirect', function(req, res) {
	return githubOAuth.callback(req, res);
});

githubOAuth.on('error', function(err) {
	console.error('there was a login error', err);
	throw new errors.UnauthorizedError(err);
});

githubOAuth.on('token', function(token, res) {
	const access_token = token.access_token;

	api.getUserProfile(access_token).then(profile => {

		let {login, avatar_url, email, name} = profile;

		find.findOneUser({login: profile.login}).then(user => {
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

			res.send({
				user: profile,
				token: oauth
			});
		});

	}).catch(err => {
		throw new errors.InternalServerError(err);
	});
});

module.exports = router;
