'use strict';

var path = require('path'),
	chai = require('chai'),
	errorHelper = require(path.join(global.__libdir, 'errorHelper'));

var assert = chai.assert;

module.exports = function () {

	describe('errorHelper', function () {

		describe('getValidationError', function () {

			it('should return a properly configured Error object', function () {
				var message = 'test',
					result = errorHelper.getValidationError(message);

				assert.instanceOf(result, Error, 'getValidationError did not return a Error');
				assert.propertyVal(result, 'message', message, 'getValidationError did not return the correct message');
				assert.propertyVal(result, 'type', 'INVALID_ARGUMENT', 'getValidationError did not return the correct type');
			});

		});

		describe('getNotFoundError', function () {

			it('should return a properly configured Error object', function () {
				var message = 'test',
					result = errorHelper.getNotFoundError(message);

				assert.instanceOf(result, Error, 'getNotFoundError did not return a Error');
				assert.propertyVal(result, 'message', message, 'getNotFoundError did not return the correct message');
				assert.propertyVal(result, 'type', 'NOT_FOUND', 'getNotFoundError did not return the correct type');
			});

		});

	});

};