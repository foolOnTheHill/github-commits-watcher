
module.exports = (req, res, next) => {
	if (req.session.user && req.cookies.token) {
		res.redirect('/app');
	} else {
		next();
	}
};
