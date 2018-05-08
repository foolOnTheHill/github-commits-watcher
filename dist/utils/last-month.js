"use strict";

module.exports = function () {
	var today = new Date();
	var lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

	return lastMonth.toISOString();
};