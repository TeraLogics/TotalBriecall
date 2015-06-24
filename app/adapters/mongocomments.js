'use strict';

var _ = require('underscore'),
	Promise = require('bluebird'),
	Comments = require('./models/comments');

/**
 * Gets comments for a list of recall numbers.
 * @param {String[]} recallNumbers A list of recall numbers.
 * @returns {Promise.<Object[]>|Promise<Object[]>} Returns a list of comments
 */
exports.get = function (recallNumbers) {
	return Promise.resolve(Comments.find({
		recallnumber: { $in: recallNumbers }
	}).exec()).then(function (comments) {
		return _.map(comments, function (comment) {
			return comment.toObject();
		});
	}).catch(function (err) {
		console.error('Failed to get comments: ' + err);
		throw new Error('Failed to get comments');
	});
};

/**
 * Adds a comment.
 * @param {Object} obj
 * @param {String} obj.recallnumber The recall number.
 * @param {String} obj.name The user's name.
 * @param {String} [obj.location] The location of the user.
 * @param {String} obj.comment The comment.
 * @returns {Promise.<Object>|Promise<Object>}
 */
exports.add = function (obj) {
	return Promise.resolve(Comments.create({
		recallnumber: obj.recallnumber,
		name: obj.name,
		location: obj.location,
		comment: obj.comment
	})).then(function (comment) {
		return comment.toObject();
	}).catch(function (err) {
		console.error('Failed to add comment: ' + err);
		throw new Error('Failed to add comment');
	});
};