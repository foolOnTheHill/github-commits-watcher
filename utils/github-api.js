const request = require('../utils/request');

const lastMonth = require('../utils/last-month');

const ENDPOINTS = require('../utils/endpoints');

const getUserProfile = (token) => {
	return request('GET', ENDPOINTS.profile, token).then(data => {
		let { login, avatar_url, email, name } = data;

		return {
			login,
			avatar_url,
			email,
			name
		};
	});
};

const getRepoInfo = (token, owner, repo_name) => {
	const endpoint = `ENDPOINTS.repository/${owner}/${repo_name}`;

	return request('GET', endpoint, token).then(data => {
		let { full_name, description, created_at } = data;

		return {
			name: full_name,
			created_date: created_at,
			description
		};
	});
};

const getRepoLastMonthCommits = (token, owner, repo_name) => {
	const endpoint = `ENDPOINTS.repository/${owner}/${repo_name}/commits`;
	const qs = { since : lastMonth() };

	return request('GET', endpoint, token, qs).then(data => {

		return data.map(info => {
			const commit = info.commit;

			let { author, message, tree } = commit;

			const author_string = `${author.name} (${author.email})`;
			const date = author.date;
			const hash = tree.sha;

			return {
				author: author_string,
				date,
				hash,
				message
			};
		});
	});
};

module.exports = {
	getUserProfile,
	getRepoInfo,
	getRepoLastMonthCommits
};
