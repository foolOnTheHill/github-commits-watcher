'use strict';

var compareCommits = function compareCommits(commitA, commitB) {
	var dateA = new Date(commitA.date || '');
	var dateB = new Date(commitB.date || '');

	return dateA.getTime() - dateB.getTime();
};

module.exports = function (commits) {
	return commits.sort(compareCommits);
};