const request = require('request-promise');

const config = require('../config/config');
const API_BASE_URL = config.API_BASE_URL;

const prepareURL = (endpoint) => {
	return `${API_BASE_URL}/${endpoint}`;
};

const prepareOptions = (token, uri, method, qs) => {
	return {
		method,
		uri,
		qs,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
			'Authorization': `token ${token}`
		},
		json: true
	};
};

module.exports = (method='GET', endpoint, token, qs={}) => {
	const url = prepareURL(endpoint);
	const options = prepareOptions(token, url, method, qs);

	return request(options);
};
