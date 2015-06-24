'use strict';

var _ = require('underscore'),
	path = require('path'),
	chai = require('chai'),
	recallHelper = require(path.join(global.__libdir, 'recallHelper'));

var assert = chai.assert;

module.exports = function () {

	describe('recallHelper', function () {

		it('should export stateMappings property', function () {
			assert.property(recallHelper, 'stateMappings', 'recallHelper did not export stateMappings');
			assert.isObject(recallHelper.stateMappings);
		});

		it('should export keywordMappings property', function () {
			assert.property(recallHelper, 'keywordMappings', 'recallHelper did not export keywordMappings');
			assert.isObject(recallHelper.keywordMappings);
		});

		it('should export statusKeys property', function () {
			assert.property(recallHelper, 'statusKeys', 'recallHelper did not export statusKeys');
			assert.isArray(recallHelper.statusKeys);
		});

		it('should export supportedCountFields property', function () {
			assert.property(recallHelper, 'supportedCountFields', 'recallHelper did not export supportedCountFields');
			assert.isArray(recallHelper.supportedCountFields);
		});

		describe('isValidState', function () {

			it('should return false when the input is not a valid string', function () {
				var state = 1,
					result = recallHelper.isValidState(state);

				assert.isFalse(result, 'isValidState returned true with an invalid string');
			});

			it('should return false when the input is not a valid state abbreviation', function () {
				var state = 'test',
					result = recallHelper.isValidState(state);

				assert.isFalse(result, 'isValidState returned true with an invalid state');
			});

			it('should return true when the input is a valid state abbreviation (lowercase)', function () {
				var state = 'va',
					result = recallHelper.isValidState(state);

				assert.isTrue(result, 'isValidState returned false with a state');
			});

			it('should return true when the input is a valid state abbreviation (uppercase)', function () {
				var state = 'VA',
					result = recallHelper.isValidState(state);

				assert.isTrue(result, 'isValidState returned false with a state');
			});

		});

		describe('areValidKeywords', function () {

			it('should return null when the input is not a valid array', function () {
				var keywords = null,
					result = recallHelper.areValidKeywords(keywords);

				assert.isNull(result, 'areValidKeywords did not return null with an invalid array');
			});

			it('should return the first invalid keyword when the input has an valid keyword', function () {
				var keywords = ['test'],
					result = recallHelper.areValidKeywords(keywords);

				assert.equal(result, keywords[0], 'areValidKeywords returned true with an invalid keyword');
			});

			it('should return undefined when the inputs are valid keywords', function () {
				var keywords = _.keys(recallHelper.keywordMappings),
					result = recallHelper.areValidKeywords(keywords);

				assert.isUndefined(result, 'areValidKeywords returned false with valid keywords');
			});

		});

		describe('isValidStatus', function () {

			it('should return false when the input is not a valid string', function () {
				var status = 1,
					result = recallHelper.isValidStatus(status);

				assert.isFalse(result, 'isValidStatus returned true with an invalid string');
			});

			it('should return false when the input is not a valid status abbreviation', function () {
				var status = 'test',
					result = recallHelper.isValidStatus(status);

				assert.isFalse(result, 'isValidStatus returned true with an invalid status');
			});

			it('should return true when the input is a valid status abbreviation (lowercase)', function () {
				var status = 'ongoing',
					result = recallHelper.isValidStatus(status);

				assert.isTrue(result, 'isValidStatus returned false with a valid status');
			});

			it('should return true when the input is a valid status abbreviation (uppercase)', function () {
				var status = 'ONGOING',
					result = recallHelper.isValidStatus(status);

				assert.isTrue(result, 'isValidStatus returned false with a valid status');
			});

		});

		describe('isValidCountField', function () {

			it('should return false when the input is not a valid string', function () {
				var field = 1,
					result = recallHelper.isValidCountField(field);

				assert.isFalse(result, 'isValidCountField returned true with an invalid string');
			});

			it('should return false when the input is not a valid field abbreviation', function () {
				var field = 'test',
					result = recallHelper.isValidCountField(field);

				assert.isFalse(result, 'isValidCountField returned true with an invalid field');
			});

			it('should return true when the input is a valid field abbreviation (lowercase)', function () {
				var field = 'classification',
					result = recallHelper.isValidCountField(field);

				assert.isTrue(result, 'isValidCountField returned false with a valid field');
			});

			it('should return true when the input is a valid field abbreviation (uppercase)', function () {
				var field = 'CLASSIFICATION',
					result = recallHelper.isValidCountField(field);

				assert.isTrue(result, 'isValidCountField returned false with a valid field');
			});

		});

	});

};