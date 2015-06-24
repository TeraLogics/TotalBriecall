'use strict';

var _ = require('underscore');

//http://stackoverflow.com/a/8571649
var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

/**
 * Validates an integer.
 * @param {*} input The input.
 * @returns {Boolean} Whether or not the input is an integer
 */
exports.isInt = function (input) {
	return _.isFinite(parseInt(input, 10));
};

/**
 * Validates a base64 encoded string.
 * @param {String} input The input.
 * @returns {Boolean} Whether or not the input is a base64 encoded string
 */
exports.isBase64String = function (input) {
	return _.isString(input) && base64Regex.test(input);
};
