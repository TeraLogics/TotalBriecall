'use strict';

/**
 * Gets a custom error with extra properties.
 * @param {String} message The error message.
 * @param {String} type The type of error.
 * @returns {Error} The error.
 * @private
 */
function getError (message, type) {
	var e = new Error(message);
	e.type = type;
	return e;
}

/**
 * Gets a custom error with extra properties.
 * @param {String} message The error message.
 * @returns {Error} The error.
 */
exports.getValidationError = function (message) {
	return getError(message, 'INVALID_ARGUMENT');
};

/**
 * Gets a custom error with extra properties.
 * @param {String} message The error message.
 * @returns {Error} The error.
 */
exports.getNotFoundError = function (message) {
	return getError(message, 'NOT_FOUND');
};
