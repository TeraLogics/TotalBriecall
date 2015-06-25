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
 * @param {Object} obj The params object.
 * @param {Number} obj.id The recall id.
 * @returns {Promise.<Object>} A recall.
 */
exports.getById = function (obj) {
	return Promise.try(function validate() {
		if (!obj.id || !validationHelper.isBase64String(obj.id)) {
			throw errorHelper.getValidationError('Invalid id');
		}
	}).then(function () {
		return fdaAdapter.getFoodRecallById({
			id: obj.id
		}).then(function (recallResult) {
			return mongoAdapter.getComments([recallResult.recall_number]).then(function (comments) {
				recallResult.comments = _.chain(comments)
					.where({ recallnumber: recallResult.recall_number })
					.map(function (comment) {
						// delete mongo's internal stuff
						delete comment.__v;
						delete comment._id;
						// remove the recall number as it's duplicated from the recall record
						delete comment.recallnumber;

						return comment;
					})
					.value();

				return recallResult;
			});
		});
	});
};

/**
 * Gets recalls for matches against provided input.
 * @param {Object} obj The params object.
 * @param {String} [obj.state] The state to search by.
 * @param {Number} [obj.eventid] The event id to search by.
 * @param {String} [obj.from] The start date to search by.
 * @param {String} [obj.to] The end date to search by.
 * @param {String[]} [obj.classificationlevels] A list of classification levels to search by.
 * @param {String[]} [obj.keywords] A list of key words to search by.
 * @param {Number} [obj.skip] The number of records to skip.
 * @param {Number} [obj.limit] The number or records to fetch.
 * @returns {Promise<Object>} A list of recalls and their metadata.
 */
exports.search = function (obj) {
	return Promise.try(function validate() {
		if (obj.state && !recallHelper.isValidState(obj.state)) {
			throw errorHelper.getValidationError('Invalid state');
		}

		if (obj.status && !recallHelper.isValidStatus(obj.status)) {
			throw errorHelper.getValidationError('Invalid status');
		}

		if (obj.eventid && !validationHelper.isInt(obj.eventid)) {
			throw errorHelper.getValidationError('Invalid eventid');
		}

		if (obj.from && (!validationHelper.isInt(obj.from) || !moment.unix(obj.from).isValid())) {
			throw errorHelper.getValidationError('Invalid from');
		}

		if (obj.to && (!validationHelper.isInt(obj.to) || !moment.unix(obj.to).isValid())) {
			throw errorHelper.getValidationError('Invalid to');
		}

		if ((obj.to && !obj.from) || (obj.from && !obj.to)) {
			throw errorHelper.getValidationError('Invalid from/to - both must be provided if one is');
		}

		if (obj.to && obj.from && obj.from >= obj.to) {
			throw errorHelper.getValidationError('Invalid from/to - from must be before to');
		}

		if (obj.classificationlevels && (!_.isArray(obj.classificationlevels) || !_.every(obj.classificationlevels, function (level) {
				return validationHelper.isInt(level) && level >= 1 && level <= 3;
			}))) {
			throw errorHelper.getValidationError('Invalid classificationlevels');
		}

		if (obj.keywords && recallHelper.areValidKeywords(obj.keywords) !== undefined) {
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
		return mongoAdapter.getComments(_.pluck(recallResults.data, 'recall_number')).then(function (comments) {
			recallResults.data = _.map(recallResults.data, function (r) {
				r.comments = _.chain(comments)
					.where({ recallnumber: r.recall_number })
					.map(function (comment) {
						// delete mongo's internal stuff
						delete comment.__v;
						delete comment._id;
						// remove the recall number as it's duplicated from the recall record
						delete comment.recallnumber;

						return comment;
					})
					.value();
				return r;
			});

			return recallResults;
		});
	});
};

/**
 * Gets counts.
 * @param {Object} obj The params object.
 * @param {String} obj.field The field to count by.
 * @param {String} [obj.state] The state to count by.
 * @param {String} [obj.status] The status to count by.
 * @returns {Promise} The recall counts.
 */
exports.getCounts = function (obj) {
	return Promise.try(function validate() {
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