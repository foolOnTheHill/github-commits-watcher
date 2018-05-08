'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommitSchema = new Schema({
	date: Date,
	message: String,
	author: String,
	hash: String,
	repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' }
});

module.exports = mongoose.model('Commit', CommitSchema);