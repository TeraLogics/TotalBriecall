'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

/**
 * Converts input to a valid integer or undefined
 * @param input
 * @returns {Number|undefined}
 * @private
 */
function _validateNumber(input) {
	var temp;
	try {
		temp = parseInt(input, 10);
		if (!_.isFinite(temp)) {
			temp = undefined;
		}
	} catch(e) {
		return undefined;
	}

	return temp;
}

/**
 * Sends invalid argument error to client
 * @param message
 * @param res
 * @private
 */
function _rejectArgument(message, res) {
	res.status(409).json({
		error: {
			code: 'INVALID_ARGUMENT',
			message: message
		}
	});
}

/**
 * Outputs response from database and handles errors
 * @param {Promise} promise
 * @param res
 * @private
 */
function _processResponse(promise, res) {
	promise.then(function (foodResult) {
		res.json(foodResult);
	}).catch(function (err) {
		if (err.message) {
			_rejectArgument(err.message, res);
		} else {
			res.status(err.statusCode).json({
				error: err.error
			});
		}
	}).done();
}

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

	_processResponse(fdaAdapter.getFoodRecallById(obj), res);
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
		obj.eventid = _validateNumber(req.query.eventid);
		if (_.isUndefined(obj.eventid)) {
			_rejectArgument('Invalid eventid', res);
			return;
		}
	}

	if (req.query.firmname) {
		obj.firmname = req.query.firmname;
	}

	if (req.query.from || req.query.to) {
		obj.from = _validateNumber(req.query.from);
		if (_.isUndefined(obj.from) || !moment.unix(obj.from).isValid()) {
			_rejectArgument('Invalid from', res);
			return;
		}
		obj.to = _validateNumber(req.query.to);
		if (_.isUndefined(obj.to) || !moment.unix(obj.to).isValid()) {
			_rejectArgument('Invalid to', res);
			return;
		}

		if (obj.from >= obj.to) {
			_rejectArgument('Invalid from/to - from must be before to', res);
		}
	}

	if (req.query.classificationlevels) {
		if (!_.isArray(req.query.classificationlevels)) {
			req.query.classificationlevels = req.query.classificationlevels.split(',');
		}

		obj.classificationlevels = [];

		var i = 0;
		for (; i < req.query.classificationlevels.length; i++) {
			var temp = _validateNumber(req.query.classificationlevels[i]);
			if (_.isUndefined(temp)) {
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
		obj.skip = _validateNumber(req.query.skip);
		if (_.isUndefined(obj.skip)) {
			_rejectArgument('Invalid skip', res);
			return;
		}
	}

	if (req.query.limit) {
		obj.limit = _validateNumber(req.query.limit);
		if (_.isUndefined(obj.limit)) {
			_rejectArgument('Invalid limit', res);
			return;
		}
	}

	_processResponse(fdaAdapter.searchFoodRecalls(obj), res);
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

	_processResponse(fdaAdapter.getFoodRecallsCounts(obj), res);
};
