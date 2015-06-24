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
 * Sends invalid argument error to client
 * @param res
 * @param type
 * @param message
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
 * @param {Error} err The error.
 * @param {Object} res The HTTP response object.
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
 * Adds a comment to a recall
 * @param req
 * @param {String} req.body.recallnumber The recall number.
 * @param {String} req.body.name The user's name.
 * @param {String} [req.body.location] The location of the user.
 * @param {String} req.body.comment The comment.
 * @param res
 */
exports.addCommentForRecall = function (req, res) {
	commentsDal.add({
		recallnumber: req.body.recallnumber,
		name: req.body.name,
		location: req.body.location,
		comment: req.body.comment
	}).then(function (comment) {
		res.json(comment);
	}).catch(function (err) {
		_handleError(res, err);
	}).done();
};

/**
 * Gets recall for specific id
 * @param req
 * @param {Number} req.params.id
 * @param res
 */
exports.getRecallById = function (req, res) {
	if (req.query.skip) {
		_returnError(res, 'Invalid skip - not allowed', 'INVALID_ARGUMENT');
	} else if (req.query.limit) {
		_returnError(res, 'Invalid limit - not allowed', 'INVALID_ARGUMENT');
	} else {
		recallsDal.getById({
			id: req.params.id
		}).then(function (foodResult) {
			res.json(foodResult);
		}).catch(function (err) {
			_handleError(res, err);
		}).done();
	}
};

/* TODO
 * Filter results
 * - nationwide match: make sure there is no state designation
 * - filter out 'no' when found in distribution?
 */
/**
 * Gets recalls for matches against provided input
 * @param req
 * @param {String} [req.query.state]
 * @param {String} [req.query.from]
 * @param {String} [req.query.to]
 * @param {String[]|String} [req.query.classificationlevels]
 * @param {String[]} [req.query.keywords]
 * @param res
 */
exports.getRecalls = function (req, res) {
	var obj = {
		firmname: req.query.firmname,
		from: _toNumber(req.query.from),
		to: _toNumber(req.query.to),
		state: req.query.state,
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
			obj.classificationlevels.push(temp);
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
 * Gets counts
 * @param req
 * @param {String} req.query.field
 * @param {String} [req.query.state]
 * @param {String} [req.query.status]
 * @param res
 */
exports.getRecallsCounts = function (req, res) {
	if (req.query.skip) {
		_returnError(res, 'Invalid skip - not allowed', 'INVALID_ARGUMENT');
	} else if (req.query.limit) {
		_returnError(res, 'Invalid limit - not allowed', 'INVALID_ARGUMENT');
	} else {
		recallsDal.getCounts({
			field: req.query.field,
			state: req.query.state,
			status: req.query.status
		}).then(function (counts) {
			res.json(counts);
		}).catch(function (err) {
			_handleError(res, err);
		}).done();
	}
};
