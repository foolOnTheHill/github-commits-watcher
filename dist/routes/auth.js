'use strict';

var express = require('express');
var router = express.Router();

var errors = require('restify-errors');

var request = require('request-promise');

var sessionChecker = require('../middleware/session-checker');

var api = require('../utils/github-api');

var jwt = require('../utils/jwt');

var create = require('../database/dal/create');
var update = require('../database/dal/update');
var find = require('../database/dal/find');

var config = require('../config/config');

var port = process.env.PORT || 8080;

var githubOAuth = require('github-oauth')({
	githubClient: config.GITHUB_KEY,
	githubSecret: config.GITHUB_SECRET,
	baseURL: 'http://localhost:' + port,
	loginURI: '/',
	callbackURI: '/login/redirect'
});

router.get('/', sessionChecker, function (req, res) {
	return githubOAuth.login(req, res);
});

router.post('/', sessionChecker, function (req, res) {
	var _req$body = req.body,
	    code = _req$body.code,
	    state = _req$body.state;


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
	}).then(function (result) {

		var access_token = result.access_token;

		api.getUserProfile(access_token).then(function (profile) {
			var login = profile.login,
			    avatar_url = profile.avatar_url,
			    email = profile.email,
			    name = profile.name;


			find.findOneUser(login).then(function (user) {
				if (user) {
					return update.updateUserProfile(user._id, profile);
				} else {
					return create.newUser(login, avatar_url, email, name);
				}
			}).then(function () {
				var oauth = jwt.sign({
					access_token: access_token,
					login: login,
					avatar_url: avatar_url,
					email: email,
					name: name
				});

				var token = {
					user: profile,
					token: oauth
				};

				req.session.user = token;

				res.send(token);
			});
		});
	}).catch(function (error) {
		throw new errors.UnauthorizedError(error);
	});
});

module.exports = router;