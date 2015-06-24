'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	commentsAdapter = require(path.join(global.__adptsdir, 'mongocomments')),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

/**
 * Converts `input` to an integer.
 * @param {*} input The input.
 * @returns {Number|NaN} The number; or, if `input` cannot be converted, `NaN`.
 * @private
 */
function _toNumber (input) {
	var number = parseInt(input, 10);

	return _.isFinite(number) ? number : NaN;
}

/**
 * Sends invalid argument error to client
 * @param message
 * @param res
 * @private
 */
function _rejectArgument (message, res) {
	res.status(409).json({
		error: {
			code: 'INVALID_ARGUMENT',
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
function _handleError (err, res) {
	if (err instanceof Error) {
		// errors raised by the adapter
		_rejectArgument(err.message, res);
	} else if (err && err.statusCode && err.error) {
		// errors probably in a ServerResponse from the FDA API
		res.status(err.statusCode).json({
			error: err.error
		});
	} else {
		// anything else
		if (err) {
			console.error(err);
		}

		res.status(500).json({
			error: {
				code: 'INTERNAL_ERROR',
				message: 'An unknown error occurred.'
			}
		});
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
	// TODO validate recall number against pattern?
	if (!req.body.recallnumber || !_.isString(req.body.recallnumber)) {
		_rejectArgument('Invalid recallnumber', res);
	} else if (!req.body.name || !_.isString(req.body.name)) {
		_rejectArgument('Invalid name', res);
	} else if (req.body.location && !_.isString(req.body.location)) {
		_rejectArgument('Invalid location', res);
	} else if (req.body.location && !fdaAdapter.isValidState(req.body.location)) {
		_rejectArgument('Location must be a valid state', res);
	} else if (!req.body.comment || !_.isString(req.body.comment)) {
		_rejectArgument('Invalid comment', res);
	} else {
		commentsAdapter.add({
			recallnumber: req.body.recallnumber,
			name: req.body.name,
			location: req.body.location,
			comment: req.body.comment
		}).then(function (comment) {
			res.json(comment);
		}).catch(function (err) {
			_handleError(err, res);
		}).done();
	}
};

/**
 * Gets recall for specific id
 * @param req
 * @param {Number} req.params.id
 * @param res
 */
exports.getRecallById = function (req, res) {
	var obj = {};

	obj.id = req.params.id; // TODO validate against pattern?

	if (req.query.skip) {
		_rejectArgument('Invalid skip - not allowed', res);
		return;
	}

	if (req.query.limit) {
		_rejectArgument('Invalid limit - not allowed', res);
		return;
	}

	fdaAdapter.getFoodRecallById(obj).then(function (foodResult) {
		if (foodResult) {
			return commentsAdapter.get([foodResult.recall_number]).then(function (comments) {
				foodResult.comments = _.chain(comments)
					.where({recallnumber: foodResult.recall_number})
					.map(function (comment) {
						delete comment.recallnumber;
						return comment;
					})
					.value();

				return foodResult;
			});
		}

		throw {
			statusCode: 404,
			error: {
				code: 'NOT_FOUND',
				message: 'No matches found!'
			}
		};
	}).then(function (foodResult) {
		res.json(foodResult);
	}).catch(function (err) {
		_handleError(err, res);
	}).done();
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
	var obj = {};

	if (req.query.state) {
		if (!fdaAdapter.isValidState(req.query.state)) {
			_rejectArgument('Invalid state', res);
			return;
		}
		obj.state = req.query.state;
	}

	if (req.query.eventid) {
		obj.eventid = _toNumber(req.query.eventid);
		if (_.isNaN(obj.eventid)) {
			_rejectArgument('Invalid eventid', res);
			return;
		}
	}

	if (req.query.firmname) {
		obj.firmname = req.query.firmname;
	}

	if (req.query.from || req.query.to) {
		obj.from = _toNumber(req.query.from);
		if (_.isNaN(obj.from) || !moment.unix(obj.from).isValid()) {
			_rejectArgument('Invalid from', res);
			return;
		}
		obj.to = _toNumber(req.query.to);
		if (_.isNaN(obj.to) || !moment.unix(obj.to).isValid()) {
			_rejectArgument('Invalid to', res);
			return;
		}

		if (obj.from >= obj.to) {
			_rejectArgument('Invalid from/to - from must be before to', res);
			return;
		}
	}

	if (req.query.classificationlevels) {
		if (!_.isArray(req.query.classificationlevels)) {
			req.query.classificationlevels = req.query.classificationlevels.split(',');
		}

		obj.classificationlevels = [];

		var i = 0;
		for (; i < req.query.classificationlevels.length; i++) {
			var temp = _toNumber(req.query.classificationlevels[i]);
			if (_.isNaN(temp)) {
				_rejectArgument('Invalid classificationlevels', res);
				return;
			}

			if (temp < 1 || temp > 3) {
				_rejectArgument('Invalid classificationlevels - must be 1, 2, or 3', res);
				return;
			}

			obj.classificationlevels.push(temp);
		}
	}

	if (req.query.keywords) {
		if (!_.isArray(req.query.keywords)) {
			req.query.keywords = req.query.keywords.split(',');
		}

		var invalid = fdaAdapter.areValidKeywords(req.query.keywords);
		if (invalid !== undefined) {
			_rejectArgument('Invalid keywords - could not match keyword ' + invalid, res);
			return;
		}
		obj.keywords = req.query.keywords;
	}

	if (req.query.skip) {
		obj.skip = _toNumber(req.query.skip);
		if (_.isNaN(obj.skip)) {
			_rejectArgument('Invalid skip', res);
			return;
		}
	}

	if (req.query.limit) {
		obj.limit = _toNumber(req.query.limit);
		if (_.isNaN(obj.limit)) {
			_rejectArgument('Invalid limit', res);
			return;
		}
	}

	fdaAdapter.searchFoodRecalls(obj).then(function (foodResult) {
		if (foodResult.data.length > 0) {
			return commentsAdapter.get(_.pluck(foodResult.data, 'recall_number')).then(function (comments) {
				foodResult.data = _.map(foodResult.data, function (r) {
					r.comments = _.chain(comments)
						.where({recallnumber: r.recall_number})
						.map(function (comment) {
							delete comment.recallnumber;
							return comment;
						})
						.value();
					return r;
				});

				return foodResult;
			});
		}

		return foodResult;
	}).then(function (foodResult) {
		res.json(foodResult);
	}).catch(function (err) {
		_handleError(err, res);
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
	var obj = {};

	if (!req.query.field || !fdaAdapter.isValidCountField(req.query.field)) {
		_rejectArgument('Invalid field', res);
		return;
	}
	obj.field = req.query.field;

	if (req.query.state) {
		if (!fdaAdapter.isValidState(req.query.state)) {
			_rejectArgument('Invalid state', res);
			return;
		}
		obj.state = req.query.state;
	}

	if (req.query.status) {
		if (!fdaAdapter.isValidStatus(req.query.status)) {
			_rejectArgument('Invalid status', res);
			return;
		}
		obj.status = req.query.status;
	}

	if (req.query.skip) {
		_rejectArgument('Invalid skip - not allowed', res);
		return;
	}

	if (req.query.limit) {
		_rejectArgument('Invalid limit - not allowed', res);
		return;
	}

	fdaAdapter.getFoodRecallsCounts(obj).then(function (counts) {
		res.json(counts);
	}).catch(function (err) {
		_handleError(err, res);
	}).done();
};
