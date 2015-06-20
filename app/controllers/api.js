'use strict';

var _ = require('underscore'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

var stateMappings = {
		AL: ['AL', 'Alabama'],
		AK: ['AK', 'Alaska'],
		AZ: ['AZ', 'Arizona'],
		AR: ['AR', 'Arkansas'],
		CA: ['CA', 'California'],
		CO: ['CO', 'Colorado'],
		CT: ['CT', 'Connecticut'],
		DE: ['DE', 'Delaware'],
		FL: ['FL', 'Florida'],
		GA: ['GA', 'Georgia'],
		HI: ['HI', 'Hawaii'],
		ID: ['ID', 'Idaho'],
		IL: ['IL', 'Illinois'],
		IN: ['IN', 'Indiana'],
		IA: ['IA', 'Iowa'],
		KS: ['KS', 'Kansas'],
		KY: ['KY', 'Kentucky'],
		LA: ['LA', 'Louisiana'],
		ME: ['ME', 'Maine'],
		MD: ['MD', 'Maryland'],
		MA: ['MA', 'Massachusetts'],
		MI: ['MI', 'Michigan'],
		MN: ['MN', 'Minnesota'],
		MS: ['MS', 'Mississippi'],
		MO: ['MO', 'Missouri'],
		MT: ['MT', 'Montana'],
		NE: ['NE', 'Nebraska'],
		NV: ['NV', 'Nevada'],
		NH: ['NH', 'New Hampshire'],
		NJ: ['NJ', 'New Jersey'],
		NM: ['NM', 'New Mexico'],
		NY: ['NY', 'New York'],
		NC: ['NC', 'North Carolina'],
		ND: ['ND', 'North Dakota'],
		OH: ['OH', 'Ohio'],
		OK: ['OK', 'Oklahoma'],
		OR: ['OR', 'Oregon'],
		PA: ['PA', 'Pennsylvania'],
		RI: ['RI', 'Rhode Island'],
		SC: ['SC', 'South Carolina'],
		SD: ['SD', 'South Dakota'],
		TN: ['TN', 'Tennessee'],
		TX: ['TX', 'Texas'],
		UT: ['UT', 'Utah'],
		VT: ['VT', 'Vermont'],
		VA: ['VA', 'Virginia'],
		WA: ['WA', 'Washington'],
		WV: ['WV', 'West Virginia'],
		WI: ['WI', 'Wisconsin'],
		WY: ['WY', 'Wyoming'],
		DC: ['DC', 'District of Columbia', 'D.C.']
	},
	nationalTerms = [
		'nationwide', // misspellings in database will exclude 'natiowide'
		'national distribution',
		'nation wide',
		'nationally',
		'us',
		'usa'
	],
// TODO expand keyword mappings
	keywordMappings = {
		'dairy': ['dairy', 'milk', 'cheese', 'cheeses', 'whey'],
		'dye': ['dye', 'color', 'colors', 'red', 'yellow', 'pink', 'blue', 'green'],
		'egg': ['egg', 'eggs'],
		'fish': ['fish', 'shellfish', 'oyster', 'oysters'],
		'gluten': ['gluten', 'wheat'],
		'nut': ['nut', 'nuts', 'peanut', 'peanuts', 'seed', 'seeds', 'walnuts', 'almond', 'almonds', 'pistachio', 'pistachio', 'hazelnut', 'hazelnuts'],
		'soy': ['soy', 'tofu']
	};

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
			code: "Invalid Argument",
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
	promise.then(function (response) {
		res.json(response);
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

	if (req.params.skip) {
		_rejectArgument('Invalid skip - not allowed', res);
		return;
	}

	if (req.params.limit) {
		_rejectArgument('Invalid limit - not allowed', res);
		return;
	}

	_processResponse(fdaAdapter.getFoodRecallById(obj), res);
};

/**
 * Gets recalls for event
 * @param req
 * @param {Number} req.params.id
 * @param res
 */
exports.getRecallByEventId = function (req, res) {
	var obj = {};

	obj.id = _validateNumber(req.params.id);
	if (_.isUndefined(obj.id)) {
		_rejectArgument('Invalid id', res);
		return;
	}

	if (req.params.skip) {
		obj.skip = _validateNumber(req.params.skip);
		if (_.isUndefined(obj.skip)) {
			_rejectArgument('Invalid skip', res);
			return;
		}
	}

	if (req.params.limit) {
		obj.limit = _validateNumber(req.params.limit);
		if (_.isUndefined(obj.limit)) {
			_rejectArgument('Invalid limit', res);
			return;
		}
	}

	_processResponse(fdaAdapter.getFoodRecallByEventId(obj), res);
};

/**
 * Gets recalls for recalling firm
 * @param req
 * @param {String} req.params.name
 * @param res
 */
exports.getRecallByRecallingFirm = function (req, res) {
	var obj = {};

	if (req.params.skip) {
		obj.skip = _validateNumber(req.params.skip);
		if (_.isUndefined(obj.skip)) {
			_rejectArgument('Invalid skip', res);
			return;
		}
	}

	if (req.params.limit) {
		obj.limit = _validateNumber(req.params.limit);
		if (_.isUndefined(obj.limit)) {
			_rejectArgument('Invalid limit', res);
			return;
		}
	}

	_processResponse(fdaAdapter.getFoodRecallByRecallingFirm({
		name: req.params.name
	}), res);
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
 * @param {String} [req.query.classificationlevel]
 * @param {String[]} [req.query.keywords]
 * @param res
 */
exports.search = function (req, res) {
	var obj = {};

	if (req.query.state) {
		if (!stateMappings.hasOwnProperty(req.query.state.toUpperCase())) {
			_rejectArgument('Invalid state', res);
			return;
		}
		obj.locations = stateMappings[req.query.state.toUpperCase()].concat(nationalTerms);
	}

	if (req.query.from || req.query.to) {
		obj.to = _validateNumber(req.query.to);
		if (_.isUndefined(obj.to)) {
			_rejectArgument('Invalid to', res);
			return;
		}
		obj.from = _validateNumber(req.query.from);
		if (_.isUndefined(obj.from)) {
			_rejectArgument('Invalid from', res);
			return;
		}

		if (obj.from >= obj.to) {
			_rejectArgument('Invalid from/to - from must be before to', res);
		}
	}

	if (req.query.classificationlevel) {
		obj.classificationlevel = _validateNumber(req.query.classificationlevel);
		if (_.isUndefined(obj.classificationlevel)) {
			_rejectArgument('Invalid classificationlevel', res);
			return;
		}

		if (obj.classificationlevel < 1 || obj.classificationlevel > 3) {
			_rejectArgument('Invalid classificationlevel - must be 1, 2, or 3', res);
		}
	}

	if (req.query.keywords) {
		if (!_.isArray(req.query.keywords)) {
			_rejectArgument('Invalid keywords', res);
			return;
		}
		var invalid = _.find(req.query.keywords, function (keyword) {
			return !keywordMappings.hasOwnProperty(keyword.toLowerCase());
		});
		if (invalid) {
			_rejectArgument('Invalid keywords - could not match keyword ' + invalid, res);
			return;
		}
		obj.keywords = _.reduce(req.query.keywords, function (arr, keyword) {
			return arr.concat(keywordMappings[keyword.toLowerCase()]);
		}, []);
	}

	if (_.size(obj) === 0) {
		_rejectArgument('No parameters supplied', res);
		return;
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

	_processResponse(fdaAdapter.getFoodRecallBySearch(obj), res);
};
