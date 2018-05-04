const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	login : String,
	avatar_url : String,
	email : String,
	name : String
});

module.exports = mongoose.model('User', UserSchema);
