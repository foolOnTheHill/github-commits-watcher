'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepositorySchema = new Schema({
	name: String,
	description: String,
	created_date: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Repository', RepositorySchema);