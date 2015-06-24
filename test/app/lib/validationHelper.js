'use strict';

var path = require('path'),
	chai = require('chai'),
	validationHelper = require(path.join(global.__libdir, 'validationHelper'));

var assert = chai.assert;

module.exports = function () {

	describe('validationHelper', function () {

		describe('isInt', function () {

			it('should return false when the input is not a valid string number', function () {
				var result = validationHelper.isInt('test');

				assert.isFalse(result, 'isInt returned true when passed an invalid string');
			});

			it('should return false when the input is null', function () {
				var result = validationHelper.isInt(null);

				assert.isFalse(result, 'isInt returned true when passed a null');
			});

			it('should return true when the input is numerical a string', function () {
				var result = validationHelper.isInt('1');

				assert.isTrue(result, 'isInt returned false when passed a valid int string');
			});

			it('should return true when the input is a number', function () {
				var result = validationHelper.isInt(1);

				assert.isTrue(result, 'isInt returned false when passed a valid int');
			});

		});

		describe('isBase64String', function () {

			it('should return false when the input is not a string', function () {
				var result = validationHelper.isBase64String(1);

				assert.isFalse(result, 'isBase64String returned true when passed a non-string');
			});

			it('should return false when the input is not a base64 string', function () {
				var result = validationHelper.isBase64String('1');

				assert.isFalse(result, 'isBase64String returned true when passed a non-base64-encoded string');
			});

			it('should return true when the input is not a string', function () {
				var result = validationHelper.isBase64String('aaaa');

				assert.isTrue(result, 'isBase64String returned false when passed a valid base64-encoded string');
			});

		});

	});

};