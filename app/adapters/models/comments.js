var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	CommentsSchema = new Schema({
		recallnumber: {
			type: String,
			required: true,
			index: true
		},
		location: String,
		comment: {
			type: String,
			required: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

module.exports = mongoose.model('Comments', CommentsSchema);