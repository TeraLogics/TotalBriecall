'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	recallHelper = require(path.join(global.__libdir, 'recallHelper'));

var options = {
		uri: 'https://api.fda.gov/food/enforcement.json',
		method: 'GET',
		resolveWithFullResponse: true, // useful for debugging
		json: true,
		// need to use node's querystring for overriding the url encoding (fda's api does not handle it), needed to work with complex searches
		useQuerystring: true,
		// override the encode function
		qsStringifyOptions: {
			encodeURIComponent: function identity(str) { // requires node 0.12
				return str;
			}
		}
	},
	limit = 100,
	stateAbbreviations = _.keys(recallHelper.stateMappings).sort(),
	stateRegexes = _.reduce(recallHelper.stateMappings, function (memo, values, key) {
		memo[key] = new RegExp('\\b' + values.join('|') + '\\b', 'i');
		return memo;
	}, {}),
	nationalTerms = [
		'nationwide', // misspellings in database will exclude 'natiowide'
		'national distribution',
		'nation wide',
		'nationally',
		'us',
		'usa'
	],
	nationalRegex = new RegExp('\\b' + nationalTerms.join('|') + '\\b', 'i'),
	keywordRegexes = _.reduce(recallHelper.keywordMappings, function (memo, values, key) {
		memo[key] = new RegExp('\\b' + values.join('|') + '\\b', 'i');
		return memo;
	}, {}),
// TODO: fix single quotes in product descriptions
	protoPlusRegex = /\s+|,|%[0-9a-f]{2}/ig,
	dedupPlusRegex = /\++/g,
	spaceRegex = / /g,
	lastLetterRegex = /(\w)$/i;

/**
 * Format input for use in search
 * @param {String} val
 * @returns {String}
 * @private
 */
function _formatValue(val) {
	if (spaceRegex.test(val)) {
		return '"' + val.replace(spaceRegex, '+') + '"';
	} else {
		return val;
	}
}

/**
 * Converts an array of values to query string using field
 * @param {String[]} arr Values to match against
 * @param {String} [field] Field to query on
 * @returns {string}
 * @private
 */
function _convertArrayToParam(arr, field) {
	return (field ? field + ':' : '') + '(' + _.map(arr, _formatValue).join('+') + ')';
}

/**
 * Pluralizes a word (naive)
 * @param {String} word Word to pluralize
 * @returns {String|null} Pluralized string
 * @private
 */
function _pluralizeWord(word) {
	var lastLetter = word.match(lastLetterRegex);
	if (lastLetter) {
		lastLetter = lastLetter[1];
	}
	switch (lastLetter) {
		case null:
		case 's':
			return word;
		case 'y':
			return word.replace(lastLetterRegex, 'ies');
		case 'o':
		case 'i':
			return word + 'es';
		default:
			return word + 's';
	}
}

/**
 * Encodes select foodrecall object properties to base64
 * @param {Object} foodrecall The food recall object to encode
 * @returns {String}
 * @private
 */
function _encodeFoodRecall(foodrecall) {
	return new Buffer(JSON.stringify([
		foodrecall.recall_number,
		foodrecall.event_id,
		foodrecall.recall_initiation_date,
		encodeURIComponent(foodrecall.product_description.substr(0, 50)).replace(protoPlusRegex, '+').replace(dedupPlusRegex, '+').split('+').slice(0, -1).join('+')
	])).toString('base64');
}

/**
 * Decodes select foodrecall object properties from base64
 * @param {String} val The food recall object to decode
 * @returns {Promise<Object>} foodrecall decoded properties
 * @private
 */
function _decodeFoodRecall(val) {
	return Promise.try(function (val) {
		var arr;
		try {
			arr = JSON.parse(new Buffer(val, 'base64').toString('utf8'));
		} catch (e) {
			throw {
				statusCode: 404,
				error: {
					code: 'NOT_FOUND',
					message: 'No matches found!'
				}
			};
		}

		return {
			recall_number: arr[0],
			event_id: arr[1],
			recall_initiation_date: arr[2],
			product_description: arr[3]
		};
	}, val);
}

/**
 * Takes openFDA results data and modifies it to have the desired output format
 * @param data
 * @returns {Object}
 * @private
 */
function _formatRecallResults(data) {
	data.results = _.map(data.results, function (foodrecall) {
		foodrecall.id = _encodeFoodRecall(foodrecall);

		foodrecall.recall_initiation_date = moment(foodrecall.recall_initiation_date, 'YYYY-MM-DD').unix();
		foodrecall.report_date = moment(foodrecall.report_date, 'YYYY-MM-DD').unix();

		foodrecall.classificationlevel = foodrecall.classification.match(/I/g).length;

		foodrecall.event_id = parseInt(foodrecall.event_id, 10);

		// TODO Sometimes field is null, could parse reason for recall for some
		foodrecall.mandated = foodrecall.voluntary_mandated ? foodrecall.voluntary_mandated.match(/mandated/i) !== null : false;

		// If we match a national term, select all states
		if (nationalRegex.test(foodrecall.distribution_pattern)) {
			foodrecall.affectedstates = stateAbbreviations;
			foodrecall.affectednationally = true;
		} else {
			// Otherwise, find the states that match
			foodrecall.affectedstates = _.keys(_.pick(stateRegexes, function (regex) {
				return regex.test(foodrecall.distribution_pattern);
			})).sort();
			foodrecall.affectednationally = false;
		}

		foodrecall.categories = _.keys(_.pick(keywordRegexes, function (regex) {
			return regex.test(foodrecall.product_description) || regex.test(foodrecall.reason_for_recall);
		})).sort();

		return _.omit(foodrecall, ['@id', '@epoch', 'openfda']);
	});

	return {
		skip: data.meta.results.skip,
		limit: data.meta.results.limit,
		total: data.meta.results.total,
		data: data.results
	};
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

	if (global.config.OPENFDA_APIKEY) {
		obj.api_key = global.config.OPENFDA_APIKEY;
	}

	console.log('Making request to api', obj);
	return request.get(_.extend(options, {
		qs: obj
	})).then(function (response) {
		//console.log(response);

		return response.body;
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
 * @param {String} obj.data
 * @returns {Promise}
 */
exports.getFoodRecallById = function (obj) {
	var recall_number;
	return _decodeFoodRecall(obj.id).then(function (data) {
		var search = [
			'event_id:' + data.event_id,
			'recall_initiation_date:"' + data.recall_initiation_date + '"',
			'product_description:"' + data.product_description + '"'
		];
		recall_number = data.recall_number;
		return _makeRequest({
			search: search.join('+AND+'),
			limit: 1
		});
	}).then(function (response) {
		if (response.results.length > 1) {
			var item = _.find(response.results, function (ele) {
				return ele.recall_number === recall_number;
			});
			if (!item) {
				throw {
					statusCode: 404,
					error: {
						code: 'NOT_FOUND',
						message: 'No matches found!'
					}
				};
			}

			response.results = [item];
		}

		response.meta.results.total = 1;
		return response;
	}).then(_formatRecallResults).then(function (results) {
		return results.data[0];
	});
};

/**
 * Gets food recall(s) based on search parameters
 * @param obj
 * @param {String} [obj.state]
 * @param {Number} [obj.from]
 * @param {Number} [obj.to]
 * @param {Number} [obj.classificationlevel]
 * @param {String[]} [obj.keywords]
 * @param {Number} [obj.skip]
 * @param {Number} [obj.limit]
 * @returns {Promise}
 */
exports.searchFoodRecalls = function (obj) {
	var search = [];

	if (obj.state) {
		search.push(_convertArrayToParam(recallHelper.stateMappings[obj.state.toUpperCase()].concat(nationalTerms), 'distribution_pattern'));
	}

	if (obj.eventid) {
		search.push('event_id:' + obj.id);
	}

	if (obj.firmname) {
		search.push('recalling_firm:' + _formatValue(obj.firmname));
	}

	if (obj.from && obj.to) {
		search.push('recall_initiation_date:[' + moment.unix(obj.from).utc().format('YYYY-MM-DD') + '+TO+' + moment.unix(obj.to).utc().format('YYYY-MM-DD') + ']');
	}

	if (obj.classificationlevels) {
		search.push(_convertArrayToParam(_.map(obj.classificationlevels, function (ele) {
			return 'Class ' + (new Array(ele + 1).join('I'));
		}), 'classification'));
	}

	if (obj.keywords) {
		search.push(_convertArrayToParam(_.reduce(obj.keywords, function (arr, keyword) {
			return arr.concat(_.reduce(recallHelper.keywordMappings[keyword.toLowerCase()], function (memo, item) {
				memo.push(item);
				var plural = _pluralizeWord(item);
				if (plural !== item) {
					memo.push(plural);
				}
				return memo;
			}, []));
		}, [])));
	}

	return _makeRequest({
		search: search.join('+AND+'),
		skip: obj.skip || null,
		limit: obj.limit || null
	}).then(_formatRecallResults);
};

/**
 * Gets counts for each unique item in a field
 * @param obj
 * @param {String} [obj.state]
 * @param {String} [obj.status]
 * @returns {Promise}
 */
exports.getFoodRecallsCounts = function (obj) {
	var search = [];

	if (obj.state) {
		search.push(_convertArrayToParam(recallHelper.stateMappings[obj.state.toUpperCase()].concat(nationalTerms), 'distribution_pattern'));
	}

	if (obj.status) {
		search.push('status:"' + obj.status + '"');
	}

	return _makeRequest({
		search: search.join('+AND+'),
		count: obj.field + '.exact'
	}).then(function (data) {
		var stats = { total: 0, counts: {} };

		_.each(data.results, function (result) {
			var key = result.term,
				val = result.count;

			stats.counts[key] = val;
			stats.total += val;
		});

		return stats;
	});
};
