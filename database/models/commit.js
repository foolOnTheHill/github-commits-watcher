const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommitSchema = new Schema({
	date : Date,
	message : String,
	author : String,
	hash : String,
	repository : {type: mongoose.Schema.Types.ObjectId, ref: 'Repository'}
});

module.exports = mongoose.model('Commit', CommitSchema);
