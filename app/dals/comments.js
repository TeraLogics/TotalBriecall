'use strict';

var _ = require('underscore'),
	path = require('path'),
	Promise = require('bluebird'),
	errorHelper = require(path.join(global.__libdir, 'errorHelper')),
	recallHelper = require(path.join(global.__libdir, 'recallHelper')),
	mongoAdapter = require(path.join(global.__adptsdir, 'mongo'));

/**
 * Adds a comment to a recall
 * @param {Object} obj The params object.
 * @param {String} obj.recallnumber The recall number.
 * @param {String} obj.name The user's name.
 * @param {String} [obj.location] The location of the user.
 * @param {String} obj.comment The comment.
 * @returns {Promise<Object>}
 */
exports.add = function (obj) {
	return Promise.try(function validate () {
		// TODO validate recall number against pattern?
		if (!obj.recallnumber || !_.isString(obj.recallnumber)) {
			throw errorHelper.getValidationError('Invalid recallnumber');
		}

		if (!obj.name || !_.isString(obj.name)) {
			throw errorHelper.getValidationError('Invalid name');
		}

		if (obj.location && !_.isString(obj.location)) {
			throw errorHelper.getValidationError('Invalid location');
		}

		if (obj.location && !recallHelper.isValidState(obj.location)) {
			throw errorHelper.getValidationError('Location must be a valid state');
		}

		if (!obj.comment || !_.isString(obj.comment)) {
			throw errorHelper.getValidationError('Invalid comment');
		}
	}).then(function () {
		return mongoAdapter.addComment({
			recallnumber: obj.recallnumber,
			name: obj.name,
			location: obj.location,
			comment: obj.comment
		}).then(function (comment) {
			// delete mongo's internal stuff
			delete comment.__v;
			delete comment._id;
			// remove the recall number as it's duplicated from the recall record
			delete comment.recallnumber;

			return comment;
		});
	});
};
