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
		'nut': ['nut'],
		'milk': ['milk']
	};

/**
 * TODO
 * @param req
 * @param {Number} req.params.id
 * @param res
 * @param next
 */
exports.getRecallById = function (req, res, next) {
	// TODO - validation
	//req.params.id = "recall_number"
	fdaAdapter.getFoodRecallById({
		id: req.params.id
	}).then(function (response) {
		res.json(response);
		return next();
	});
};

/**
 * TODO
 * @param req
 * @param {Number} req.params.id
 * @param res
 * @param next
 */
exports.getRecallByEventId = function (req, res, next) {
	// TODO - validation
	//req.params.id = event_id
	fdaAdapter.getFoodRecallByEventId({
		id: req.params.id
	}).then(function (response) {
		res.json(response);
		return next();
	});
};

/**
 * TODO
 * @param req
 * @param {String} req.params.name
 * @param res
 * @param next
 */
exports.getRecallByRecallingFirm = function (req, res, next) {
	// TODO - validation
	//req.params.name = recalling_firm
	fdaAdapter.getFoodRecallByRecallingFirm({
		name: req.params.name
	}).then(function (response) {
		res.json(response);
		return next();
	});
};

/* TODO
 * Filter results
 * - nationwide match: make sure there is no state designation
 * - filter out 'no' when found in distribution?
 */
/**
 * TODO
 * @param req
 * @param {String} req.query.state
 * @param {Number} req.query.from
 * @param {Number} req.query.to
 * @param {Number} req.query.classificationlevel
 * @param {String[]} req.query.keywords
 * @param res
 * @param next
 */
exports.search = function (req, res, next) {
	// TODO - validation (should also have at least one of the elements)
	//req.query.state
	//req.query.from
	//req.query.to
	//req.query.classificationlevel
	//req.query.keywords
	var obj = {};

	if (req.query.state) {
		obj.locations = stateMappings[req.query.state].concat(nationalTerms);
	}

	if (req.query.from && req.query.to) {
		obj.from = req.query.from;
		obj.to = req.query.to;
	}

	if (req.query.classificationlevel) {
		obj.classificationlevel = req.query.classificationlevel;
	}

	if (req.query.keywords) {
		obj.keywords = _.reduce(req.query.keywords, function (arr, keyword) {
			if (keywordMappings[keyword]) {
				return arr.concat(keywordMappings[keyword]);
			} else {
				return arr;
			}
		}, []);
	}

	fdaAdapter.getFoodRecallBySearch(obj).then(function (response) {
		res.json(response);
		return next();
	});
};
