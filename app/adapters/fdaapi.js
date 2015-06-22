'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	FoodResult = require(path.join(global.__modelsdir, 'foodresult'));

var options = {
		uri: 'https://api.fda.gov/food/enforcement.json',
		method: 'GET',
		resolveWithFullResponse: true, // useful for debugging
		json: true,
		// need to use node's querystring for overriding the url encoding (fda's api does not handle it), needed to work with complex searches
		useQuerystring: true,
		// override the encode function
		qsStringifyOptions: {
			encodeURIComponent: function identity(str) { return str; } // requires node 0.12
		}
	},
	limit = 100;

function _convertArrayToParam(arr, field) {
	return '(' + _.map(arr, function (ele) {
		return field + ':"' + ele.replace(/ /g, '+') + '"';
	}).join('+') + ')';
}

/**
 * Makes a request to the openFDA's api
 * @param obj
 * @param {String} obj.search
 * @param {Number} [obj.skip]
 * @param {Number} [obj.limit]
 * @returns {Promise}
 * @private
 */
function _makeRequest(obj) {
	if (obj.limit) {
		if (obj.limit > 100) {
			return Promise.reject(new Error('Invalid limit'));
		}
	} else {
		obj.limit = limit;
	}

	if (obj.skip && obj.skip > 5000) {
		return Promise.reject(new Error('Invalid skip'));
	}

	console.log('Making request to api', obj);
	return request.get(_.extend(options, {
		qs: obj
	})).then(function (response) {
		//console.log(response);
		return new FoodResult(response.body);
	}).catch(function (err) {
		//console.log(err);
		// TODO need better wrapper for error handling
		console.log(err.statusCode + ' - ' + JSON.stringify(err.error));
		throw {
			statusCode: err.statusCode,
			error: err.error.error // `error` for request -> `error` for openFDA response
		};
	});
}

/**
 * Gets food recall details for specific recall id
 * @param obj
 * @param {Number} obj.id
 * @returns {Promise}
 */
exports.getFoodRecallById = function (obj) {
	return _makeRequest({
		search: 'recall_number:' + obj.id,
		limit: 1
	});
};

/**
 * Gets food recall(s) details for event
 * @param obj
 * @param {Number} obj.id
 * @param {Number} [obj.skip]
 * @param {Number} [obj.limit]
 * @returns {Promise}
 */
exports.getFoodRecallByEventId = function (obj) {
	return _makeRequest({
		search: 'event_id:' + obj.id,
		skip: obj.skip || null,
		limit: obj.limit || null
	});
};

/**
 * Gets food recall(s) for recalling firm
 * @param obj
 * @param {String} obj.name
 * @param {Number} [obj.skip]
 * @param {Number} [obj.limit]
 * @returns {Promise}
 */
exports.getFoodRecallByRecallingFirm = function (obj) {
	return _makeRequest({
		search: 'recalling_firm:' + obj.name,
		skip: obj.skip || null,
		limit: obj.limit || null
	});
};

/**
 * Gets food recall(s) based on search parameters
 * @param obj
 * @param {String[]} [obj.locations]
 * @param {Number} [obj.from]
 * @param {Number} [obj.to]
 * @param {Number} [obj.classificationlevel]
 * @param {String[]} [obj.keywords]
 * @param {Number} [obj.skip]
 * @param {Number} [obj.limit]
 * @returns {Promise}
 */
exports.getFoodRecallBySearch = function (obj) {
	var search = [];

	if (obj.locations) {
		search.push(_convertArrayToParam(obj.locations, 'distribution_pattern'));
	}

	if (obj.from && obj.to) {
		search.push('recall_initiation_date:[' + moment.unix(obj.from).utc().format('YYYY-MM-DD') + '+TO+' + moment.unix(obj.to).utc().format('YYYY-MM-DD') + ']');
	}

	if (obj.classificationlevel) {
		search.push('classification:"Class+' + (new Array(obj.classificationlevel + 1).join('I')) + '"');
	}

	if (obj.keywords) {
		search.push(_convertArrayToParam(obj.keywords, 'reason_for_recall'));
	}

	return _makeRequest({
		search: search.join('+AND+'),
		skip: obj.skip || null,
		limit: obj.limit || null
	});
};
