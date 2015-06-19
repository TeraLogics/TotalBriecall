'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	Promise = require('bluebird'),
	request = require('request-promise');

var options = {
		uri: 'https://api.fda.gov/food/enforcement.json',
		method: 'GET'
	},
	limit = 100;

/**
 * Makes a request to the openFDA's api
 * @param obj
 * @param {String} obj.search
 * @param {Number} obj.skip
 * @param {Number} obj.limit
 * @returns {Promise}
 */
function makeRequest(obj) {
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
		return JSON.parse(response);
	}).catch(function (err) {
		// TODO determine html code to pass up
		console.log(err);
		throw err;
	});
}

/**
 * TODO
 * @param obj
 * @returns {Promise}
 */
exports.getFoodRecallById = function (obj) {
	return makeRequest({
		search: 'recall_number:' + obj.id,
		limit: 1
	});
};

/**
 * TODO
 * @param obj
 * @returns {Promise}
 */
exports.getFoodRecallByEventId = function (obj) {
	return makeRequest({
		search: 'event_id:' + obj.id
	});
};

/**
 * TODO
 * @param obj
 * @returns {Promise}
 */
exports.getFoodRecallByRecallingFirm = function (obj) {
	return makeRequest({
		search: 'recalling_firm:' + obj.name
	});
};

/**
 * TODO
 * @param obj
 * @returns {Promise}
 */
exports.getFoodRecallBySearch = function (obj) {
	var search = [];

	if (obj.locations) {
		search.push(_.map(obj.locations, function (location) {
			return 'distribution_pattern:"' + location.replace(/ /g, '+') + '"';
		}).join('+'));
	}

	if (obj.from && obj.to) {
		search.push('recall_initiation_date:[' + moment.unix(obj.from).format('YYYY-MM-DD') + '+TO+' + moment.unix(obj.to).format('YYYY-MM-DD') + ']');
	}

	if (obj.classificationlevel) {
		search.push('classification:"Class+' + Array(obj.classificationlevel).join('I') + '"');
	}

	if (obj.keywords) {
		search.push(_.map(obj.keywords, function (keyword) {
			return 'product_description:"' + keyword.replace(/ /g, '+') + '"';
		}).join('+'));
	}

	return makeRequest({
		search: search.join('+')
	});
};
