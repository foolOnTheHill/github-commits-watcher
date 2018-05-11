'use strict';

var request = require('request-promise');

var config = require('../config/config');
var API_BASE_URL = config.API_BASE_URL;

var prepareURL = function prepareURL(endpoint) {
	return API_BASE_URL + '/' + endpoint;
};

var prepareOptions = function prepareOptions(token, uri, method, qs, body) {
	return {
		method: method,
		uri: uri,
		qs: qs,
		body: body,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
			'Authorization': 'token ' + token
		},
		json: true
	};
};

module.exports = function (method, endpoint, token) {
	var qs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var body = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	var url = prepareURL(endpoint);
	var options = prepareOptions(token, url, method, qs, body);

	return request(options);
};