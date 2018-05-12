const compareCommits = (commitA, commitB) => {
	const dateA = new Date(commitA.date || '');
	const dateB = new Date(commitB.date || '');

	return dateA.getTime() - dateB.getTime();
};

module.exports = (commits) => {
	return commits.sort(compareCommits);
};
