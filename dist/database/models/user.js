'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	login: String,
	avatar_url: String,
	email: String,
	name: String
});

module.exports = mongoose.model('User', UserSchema);