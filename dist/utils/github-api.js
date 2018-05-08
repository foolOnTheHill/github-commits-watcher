'use strict';

var request = require('../utils/request');

var lastMonth = require('../utils/last-month');

var ENDPOINTS = require('../utils/endpoints');

var getUserProfile = function getUserProfile(token) {
	return request('GET', ENDPOINTS.profile, token).then(function (data) {
		var login = data.login,
		    avatar_url = data.avatar_url,
		    email = data.email,
		    name = data.name;


		return {
			login: login,
			avatar_url: avatar_url,
			email: email,
			name: name
		};
	});
};

var getRepoInfo = function getRepoInfo(token, owner, repo_name) {
	var endpoint = ENDPOINTS.repository + '/' + owner + '/' + repo_name;

	return request('GET', endpoint, token).then(function (data) {
		var full_name = data.full_name,
		    description = data.description,
		    created_at = data.created_at;


		return {
			name: full_name,
			created_date: created_at,
			description: description
		};
	}).catch(function (error) {
		console.error(error);
	});
};

var getRepoLastMonthCommits = function getRepoLastMonthCommits(token, owner, repo_name) {
	var endpoint = ENDPOINTS.repository + '/' + owner + '/' + repo_name + '/commits';
	var qs = { since: lastMonth() };

	return request('GET', endpoint, token, qs).then(function (data) {

		return data.map(function (info) {
			var commit = info.commit;

			var author = commit.author,
			    message = commit.message,
			    tree = commit.tree;


			var author_string = author.name + ' (' + author.email + ')';
			var date = author.date;
			var hash = tree.sha;

			return {
				author: author_string,
				date: date,
				hash: hash,
				message: message
			};
		});
	}).catch(function (error) {
		console.error(error);
	});
};

module.exports = {
	getUserProfile: getUserProfile,
	getRepoInfo: getRepoInfo,
	getRepoLastMonthCommits: getRepoLastMonthCommits
};