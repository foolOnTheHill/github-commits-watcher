
module.exports = (req, res, next) => {
	if (req.cookies.token && !req.session.user) {
		res.clearCookie('token');
	}

	next();
};
