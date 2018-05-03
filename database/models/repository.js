const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepositorySchema = new Schema({
	name : String,
	owner : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Repository', RepositorySchema);
