const TOKEN_LOCATION = require('../config').TOKEN_LOCATION;

const getToken = () => {
	const TOKEN = JSON.parse(localStorage.getItem(TOKEN_LOCATION));
	return TOKEN ? TOKEN.token : null;
};


const getUser = () => {
	const TOKEN = JSON.parse(localStorage.getItem(TOKEN_LOCATION));
	return TOKEN ? TOKEN.user : null;
};

const deleteToken = () => localStorage.removeItem(TOKEN_LOCATION);

module.exports = {
	getToken,
	getUser,

	deleteToken
};
