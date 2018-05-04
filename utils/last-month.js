module.exports = () => {
	const today = new Date();
	const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

	return lastMonth.toISOString();
};
