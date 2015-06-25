'use strict';

var _ = require('underscore'),
	path = require('path'),
	commentsDal = require(path.join(global.__dalsdir, 'comments')),
	recallsDal = require(path.join(global.__dalsdir, 'recalls'));

/**
 * Converts `input` to an integer.
 * @param {*} input The input.
 * @returns {Number|NaN} The number; or, if `input` cannot be converted, `NaN`.
 * @private
 */
function _toNumber(input) {
	var number = parseInt(input, 10);
	return _.isFinite(number) ? number : NaN;
}

/**
 * Sends an error response to the client.
 * @param {Object} res The HTTP response object.
 * @param {String} [message] The error message.
 * @param {String} [type] The error type.
 * @private
 */
function _returnError(res, message, type) {
	var status;

	message = message || 'An unknown error occurred.';

	switch (type) {
		case 'INVALID_ARGUMENT':
			status = 409;
			break;
		case 'NOT_FOUND':
			status = 404;
			break;
		default:
			type = 'INTERNAL_ERROR';
			status = 500;
	}

	res.status(status).json({
		error: {
			code: type,
			message: message
		}
	});
}

/**
 * Handles error response output.
 * @param {Object} res The HTTP response object.
 * @param {Error} err The error.
 * @private
 */
function _handleError(res, err) {
	if (err instanceof Error) {
		_returnError(res, err.message, err.type);
	} else {
		if (err) {
			console.error('Unknown Error:', err);
		}

		_returnError(res);
	}
}

/**
 * Adds a comment.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.addCommentForRecall = function (req, res) {
	commentsDal.add({
		recallnumber: req.body.recallnumber,
		name: req.body.name,
		location: req.body.location || req.session.preferences.state,
		comment: req.body.comment
	}).then(function (comment) {
		res.json(comment);
	}).catch(function (err) {
		_handleError(res, err);
	}).done();
};

/**
 * Gets a recall by id.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.getRecallById = function (req, res) {
	recallsDal.getById({
		id: req.params.id
	}).then(function (foodResult) {
		res.json(foodResult);
	}).catch(function (err) {
		_handleError(res, err);
	}).done();
};

/**
 * Searches recalls.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.getRecalls = function (req, res) {
	var obj = {
		state: req.query.state,
		status: req.query.status,
		firmname: req.query.firmname,
		from: _toNumber(req.query.from),
		to: _toNumber(req.query.to),
		eventid: _toNumber(req.query.eventid),
		skip: _toNumber(req.query.skip),
		limit: _toNumber(req.query.limit)
	};

	if (req.query.classificationlevels) {
		if (!_.isArray(req.query.classificationlevels)) {
			req.query.classificationlevels = req.query.classificationlevels.split(',');
		}

		obj.classificationlevels = [];

		for (var i = 0; i < req.query.classificationlevels.length; i++) {
			var temp = _toNumber(req.query.classificationlevels[i]);

			if (!_.isNaN(temp)) {
				obj.classificationlevels.push(temp);
			}
		}
	}

	if (req.query.keywords) {
		if (!_.isArray(req.query.keywords)) {
			req.query.keywords = req.query.keywords.split(',');
		}

		obj.keywords = req.query.keywords;
	}

	recallsDal.search(obj).then(function (foodResult) {
		res.json(foodResult);
	}).catch(function (err) {
		_handleError(res, err);
	}).done();
};

/**
 * Gets recall counts.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.getRecallsCounts = function (req, res) {
	recallsDal.getCounts({
		field: req.query.field,
		state: req.query.state,
		status: req.query.status
	}).then(function (counts) {
		res.json(counts);
	}).catch(function (err) {
		_handleError(res, err);
	}).done();
};
