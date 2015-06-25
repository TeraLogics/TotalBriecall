'use strict';

var _ = require('underscore'),
	moment = require('moment'),
	path = require('path'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	errorHelper = require(path.join(global.__libdir, 'errorHelper')),
	recallHelper = require(path.join(global.__libdir, 'recallHelper')),

	options = {
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
	nationalRegex = new RegExp('\\b(' + nationalTerms.join('|') + ')\\b', 'i'),
	keywordRegexes = _.reduce(recallHelper.keywordMappings, function (memo, values, key) {
		memo[key] = new RegExp('\\b(' + values.join('|') + ')\\b', 'i');
		return memo;
	}, {}),
	protoPlusRegex = /\s+/ig,
	dedupPlusRegex = /\++/g,
	badCharacterRegex = /\W/,
	spaceRegex = / /g,
	lastLetterRegex = /(\w)$/i;

/**
 * Format input for use in search.
 * @param {String} val The value to format.
 * @returns {String} The formatted value.
 * @private
 */
function _formatValue(val) {
	if (val.search(spaceRegex) !== -1) {
		return '"' + val.replace(spaceRegex, '+') + '"';
	} else {
		return val;
	}
}

/**
 * Converts an array of values to query string using field.
 * @param {String[]} arr Values to match against.
 * @param {String} [field] Field to query on.
 * @returns {String} The formatted param.
 * @private
 */
function _convertArrayToParam(arr, field) {
	return (field ? field + ':' : '') + '(' + _.map(arr, _formatValue).join('+') + ')';
}

/**
 * Pluralizes a word (naive).
 * @param {String} word Word to pluralize.
 * @returns {String|null} Pluralized string.
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
 * Converts a food recall's product description to a blob.
 * @param {String} desc Product description of food recall.
 * @returns {String} '+' delimited string of keywords.
 * @private
 */
function _getBlobFromProductDescription(desc) {
	var parts = _.filter(desc.replace(protoPlusRegex, '+').replace(dedupPlusRegex, '+').split('+'), function (part) {
			return part.length > 3 && !badCharacterRegex.test(part);
		}).sort(function (a, b) {
			return b.length - a.length;
		}),
		i = 0,
		charSum = 0,
		used = [],
		maxWords = 8;

	for (; i < parts.length && used.length < maxWords; i++) {
		var addedLen = parts[i].length;
		if (charSum + addedLen > 50) {
			continue;
		}
		used.push(parts[i].toLowerCase());
		charSum += addedLen;
	}

	//console.log(charSum, JSON.stringify(used));

	return used.join('+');
}

/**
 * Encodes select FoodRecall object properties to base64.
 * @param {Object} foodrecall The food recall object to encode.
 * @returns {String} The encoded FoodRecall information.
 * @private
 */
function _encodeFoodRecall(foodrecall) {
	return new Buffer([
		foodrecall.recall_number,
		foodrecall.event_id,
		foodrecall.recall_initiation_date,
		_getBlobFromProductDescription(foodrecall.product_description)
	].join('\v')).toString('base64');
}

/**
 * Decodes select foodrecall object properties from base64
 * @param {String} val The food recall object to decode
 * @returns {Promise<Object>} foodrecall decoded properties
 * @private
 */
function _decodeFoodRecall(val) {
	return Promise.try(function () {
		var arr;

		try {
			arr = new Buffer(val, 'base64').toString('utf8').split('\v');
		} catch (e) {
			throw errorHelper.getValidationError('Invalid id');
		}

		if (arr.length !== 4) {
			throw errorHelper.getValidationError('Invalid id');
		}

		return {
			recall_number: arr[0],
			event_id: arr[1],
			recall_initiation_date: arr[2],
			product_description: arr[3]
		};
	});
}

/**
 * Takes openFDA results data and modifies it to have the desired output format
 * @param {Object} data The openFDA data.
 * @returns {Object} A FoodResults object
 * @private
 */
function _formatRecallResults(data) {
	data.results = _.map(data.results, function (foodrecall) {
		foodrecall.id = _encodeFoodRecall(foodrecall);
		//console.log('Encoded id length: ' + foodrecall.id.length);

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

		foodrecall.categories = _.pluck(_.reduce(keywordRegexes, function (memo, regex, key) {
			var reasonMatchPos = foodrecall.reason_for_recall.search(regex),
				reasonMatched = reasonMatchPos !== -1,
				descriptionMatchPos = foodrecall.product_description.search(regex),
				descriptionMatched = descriptionMatchPos !== -1,
				priority = 0;

			if (reasonMatched) {
				priority += 500 - reasonMatchPos;
			}

			if (descriptionMatched) {
				priority += 100 - descriptionMatchPos;
			}

			if (reasonMatched || descriptionMatched) {
				memo.push({
					'key': key,
					'value': priority
				});
			}

			return memo;
		}, []).sort(function (a, b) {
			return b.value - a.value;
		}), 'key');

		foodrecall.openfda_id = foodrecall['@id'];

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
 * Makes a request to the openFDA's api.
 * @param {Object} obj The params object.
 * @param {String} obj.search The search string that is used for searching the API.
 * @param {Number} [obj.skip] The number of records to skip.
 * @param {Number} [obj.limit] the number of records to get.
 * @returns {Promise} The openFDA response object.
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
		console.log(err.statusCode + ' - ' + JSON.stringify(err.error));
		switch (err.statusCode) {
			case 404:
				throw errorHelper.getNotFoundError('No results found');
			case 409:
				throw errorHelper.getValidationError(err.error.error.message);
			default:
				throw new Error(err.error.error.message);
		}
	});
}

/**
 * Gets food recall details for specific recall id.
 * @param {Object} obj The params object.
 * @param {String} obj.id The encoded recall id.
 * @returns {Promise} An openFDA food recall object.
 */
exports.getFoodRecallById = function (obj) {
	var recall_number;

	return _decodeFoodRecall(obj.id).then(function (data) {
		var search = [
			'event_id:' + data.event_id,
			'recall_initiation_date:"' + data.recall_initiation_date + '"',
			'product_description:(' + data.product_description.split('+').join('+AND+') + ')'
		];
		recall_number = data.recall_number;
		return _makeRequest({
			search: search.join('+AND+'),
			limit: 1
		});
	}).then(function (response) {
		if (response.meta.results.total > options.limit) {
			console.log('ERROR: TOO MANY RECALLS (' + response.meta.results.total + ') RETURNED BY ID');
		}
		//console.log('INFO: getbyid return ' + response.meta.results.total + ' results.');
		if (response.results.length > 1) {
			var item = _.find(response.results, function (ele) {
				return ele.recall_number === recall_number;
			});
			if (!item) {
				throw errorHelper.getNotFoundError('No results found');
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
 * Gets food recall(s) based on search parameters.
 * @param {Object} obj The params object.
 * @param {String} [obj.state] The state to search by.
 * @param {Number} [obj.eventid] The event id to search by.
 * @param {String} [obj.from] The start date to search by.
 * @param {String} [obj.to] The end date to search by.
 * @param {String[]} [obj.classificationlevels] A list of classification levels to search by.
 * @param {String[]} [obj.keywords] A list of key words to search by.
 * @param {Number} [obj.skip] The number of records to skip.
 * @param {Number} [obj.limit] The number of records to get.
 * @returns {Promise} A food recall result set from the openFDA aPI.
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
 * Gets counts for each unique item in a field.
 * @param {Object} obj The params object.
 * @param {String} [obj.state] The state to search by.
 * @param {String} [obj.status] The status to search by.
 * @returns {Promise<Object[]>} The number of food recalls by state.
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
		var stats = {
			total: 0,
			counts: {}
		};

		_.each(data.results, function (result) {
			var key = result.term,
				val = result.count;

			stats.counts[key] = val;
			stats.total += val;
		});

		return stats;
	});
};
