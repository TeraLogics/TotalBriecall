'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	Promise = require('bluebird'),
	errorHelper = require(path.join(global.__libdir, 'errorHelper')),
	recallHelper = require(path.join(global.__libdir, 'recallHelper')),
	validationHelper = require(path.join(global.__libdir, 'validationHelper')),
	mongoAdapter = require(path.join(global.__adptsdir, 'mongo')),
	fdaAdapter = require(path.join(global.__adptsdir, 'fda'));

/**
 * Gets recall for specific id.
 * @param obj
 * @param {Number} obj.id The recall id.
 * @returns {Promise.<Object>} A recall.
 */
exports.getById = function (obj) {
	return Promise.try(function validate () {
		if (!obj.id || !validationHelper.isBase64String(obj.id)) {
			throw errorHelper.getValidationError('Invalid id');
		}
	}).then(function () {
		return fdaAdapter.getFoodRecallById({
			id: obj.id
		}).then(function (recallResult) {
			if (recallResult) {
				return mongoAdapter.getComments([recallResult.recall_number]).then(function (comments) {
					recallResult.comments = _.chain(comments)
						.where({recallnumber: recallResult.recall_number})
						.map(function (comment) {
							delete comment.recallnumber;
							return comment;
						})
						.value();

					return recallResult;
				});
			} else {
				throw errorHelper.getNotFoundError();
			}
		});
	});
};

/**
 *
 * Gets recalls for matches against provided input.
 * @param obj
 * @param {String} [obj.state] The state to search by.
 * @param {String} [obj.from] The start date to search by.
 * @param {String} [obj.to] The end date to search by.
 * @param {String[]} [obj.classificationlevels] A list of classification levels to search by.
 * @param {String[]} [obj.keywords] A list of key words to search by.
 * @returns {Promise<Object>} A list of recalls and their metadata.
 */
exports.search = function (obj) {
	return Promise.try(function validate () {
		if (obj.state && !recallHelper.isValidState(obj.state)) {
			throw errorHelper.getValidationError('Invalid state');
		}

		if (obj.eventid && !validationHelper.isInt(obj.eventid)) {
			throw errorHelper.getValidationError('Invalid eventid');
		}

		if (obj.from && (!validationHelper.isInt(obj.from) || !moment.unix(obj.from).isValid())) {
			throw errorHelper.getValidationError('Invalid from');
		}

		if (obj.to && (!validationHelper.isInt(obj.to) || !moment.unix(obj.to).isValid())) {
			throw errorHelper.getValidationError('Invalid from');
		}

		if (obj.to && obj.from && obj.from >= obj.to) {
			throw errorHelper.getValidationError('Invalid from/to - from must be before to');
		}

		if (obj.classificationlevels && !_.isArray(obj.classificationlevels) && !_.every(obj.classificationlevels, function (c) {
				return validationHelper.isInt(c) && c >= 1 && c <= 3;
			})) {
			throw errorHelper.getValidationError('Invalid classificationlevels');
		}

		if (obj.keywords && !_.isArray(obj.keywords) && !recallHelper.areValidKeywords(obj.keywords)) {
			throw errorHelper.getValidationError('Invalid keywords - could not match keywords');
		}

		if (obj.skip && !validationHelper.isInt(obj.skip)) {
			throw errorHelper.getValidationError('Invalid skip');
		}

		if (obj.limit && !validationHelper.isInt(obj.limit)) {
			throw errorHelper.getValidationError('Invalid limit');
		}
	}).then(function () {
		return fdaAdapter.searchFoodRecalls(obj);
	}).then(function (recallResults) {
		if (recallResults.data.length > 0) {
			return mongoAdapter.getComments(_.pluck(recallResults.data, 'recall_number')).then(function (comments) {
				recallResults.data = _.map(recallResults.data, function (r) {
					r.comments = _.chain(comments)
						.where({recallnumber: r.recall_number})
						.map(function (comment) {
							delete comment.recallnumber;
							return comment;
						})
						.value();
					return r;
				});

				return recallResults;
			});
		}

		return recallResults;
	});
};

/**
 * Gets counts.
 * @param obj
 * @param {String} obj.field The field to count by.
 * @param {String} [obj.state] The state to count by.
 * @param {String} [obj.status] The status to count by.
 * @returns {Promise} The recall counts.
 */
exports.getCounts = function (obj) {
	return Promise.try(function validate () {
		if (!obj.field || !recallHelper.isValidCountField(obj.field)) {
			throw errorHelper.getValidationError('Invalid field');
		}

		if (obj.state && !recallHelper.isValidState(obj.state)) {
			throw errorHelper.getValidationError('Invalid state');
		}

		if (obj.status && !recallHelper.isValidStatus(obj.status)) {
			throw errorHelper.getValidationError('Invalid status');
		}
	}).then(function () {
		return fdaAdapter.getFoodRecallsCounts(obj);
	});
};