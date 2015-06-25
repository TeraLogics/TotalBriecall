'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	Promise = require('bluebird'),
	Comments = require('./models/comments');

/**
 * Gets comments for a list of recall numbers.
 * @param {String[]} recallNumbers A list of recall numbers.
 * @returns {Promise.<Object[]>|Promise<Object[]>} Returns a list of comments.
 */
exports.getComments = function (recallNumbers) {
	return Promise.resolve(Comments.find({
		recallnumber: { $in: recallNumbers }
	}).sort({ created: -1 }).exec()).then(function (comments) {
		return _.map(comments, function (comment) {
			var c = comment.toObject();
			c.created = moment(comment.created).unix();
			return c;
		});
	}).catch(function (err) {
		console.error('Failed to get comments: ' + err);
		throw new Error('Failed to get comments');
	});
};

/**
 * Adds a comment.
 * @param {Object} obj The params object.
 * @param {String} obj.recallnumber The recall number.
 * @param {String} obj.name The user's name.
 * @param {String} [obj.location] The location of the user.
 * @param {String} obj.comment The comment.
 * @returns {Promise.<Object>|Promise<Object>} Returns the added comment.
 */
exports.addComment = function (obj) {
	return Promise.resolve(Comments.create({
		recallnumber: obj.recallnumber,
		name: obj.name,
		location: obj.location,
		comment: obj.comment
	})).then(function (comment) {
		var c = comment.toObject();
		c.created = moment(c.created).unix();
		return c;
	}).catch(function (err) {
		console.error('Failed to add comment: ' + err);
		throw new Error('Failed to add comment');
	});
};