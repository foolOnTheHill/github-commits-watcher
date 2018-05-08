const TOKEN_LOCATION = require('../config').TOKEN_LOCATION;

const getToken = () => JSON.parse(localStorage.getItem(TOKEN_LOCATION)).token;
const getUser = () => JSON.parse(localStorage.getItem(TOKEN_LOCATION)).user;

const deleteToken = () => localStorage.removeItem(TOKEN_LOCATION);

module.exports = {
	getToken,
	getUser,

	deleteToken
};
