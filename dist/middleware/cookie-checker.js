'use strict';

module.exports = function (req, res, next) {
	if (req.cookies.token && !req.session.user) {
		res.clearCookie('token');
	}

	next();
};