const express = require('express');
const router = express.Router();

const config = require('../config');

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
});

githubOAuth.on('token', function(token, res) {
	res.end(JSON.stringify(token));
});

module.exports = router;
