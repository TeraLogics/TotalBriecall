'use strict';

var path = require('path'),
	express = require('express'),
	_ = require('underscore'),
	chai = require('chai'),
	sinon = require('sinon'),
	request = require('supertest'),
	Promise = require('bluebird'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

var app = express(),
	assert = chai.assert;

// Populate the Express routes.
require(path.join(global.__routedir, 'api'))(app);

function _createInvalidArgumentResponse(message) {
	return {
		error: {
			code: 'INVALID_ARGUMENT',
			message: message
		}
	};
}

module.exports = function () {

	describe('API', function () {

		var EMPTY_RECALL_RESULT = {
				skip: 0,
				limit: 100,
				total: 1,
				data: []
			},
			EMPTY_COUNT_RESULT = {
				total: 1,
				counts: {}
			};

		describe('getRecallById', function () {

			beforeEach(function () {
				sinon.stub(fdaAdapter, 'getFoodRecallById').returns(Promise.resolve(EMPTY_RECALL_RESULT));
			});

			afterEach(function () {
				fdaAdapter.getFoodRecallById.restore();
			});

			it('should succeed', function (done) {
				var recallId = 'F-1234-5678';

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was not called on the FDA adapter.');
						assert(fdaAdapter.getFoodRecallById.calledWith({ id: recallId }), 'getFoodRecalledById was not called with the recall ID.');
					})
					.end(done);
			});

			it('should return a 409 when skip is provided', function (done) {
				request(app)
					.get('/api/recalls/F-1234-5678')
					.query({ skip: 10 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid skip - not allowed'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when limit is provided', function (done) {
				request(app)
					.get('/api/recalls/F-1234-5678')
					.query({ limit: 10 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid limit - not allowed'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when the adapter returns a rejected promise (error)', function (done) {

				var message = 'something terrible happened';

				// re-define the stub to return a rejected promise
				fdaAdapter.getFoodRecallById.restore();
				sinon.stub(fdaAdapter, 'getFoodRecallById', function () {
					return Promise.reject(new Error(message));
				});

				request(app)
					.get('/api/recalls/F-1234-5678')
					.expect(409)
					.expect(_createInvalidArgumentResponse(message))
					.expect(function () {
						assert(fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was not called to process the response.');
					})
					.end(done);
			});

			it('should return a 409 when the adapter returns a rejected promise (response)', function (done) {

				var error = {
						error: {
							code: 'SOAP_DISH',
							message: 'Dirty soap dish.'
						}
					},
					response = {
						statusCode: 426,
						error: error.error
					};

				// re-define the stub to return a rejected promise
				fdaAdapter.getFoodRecallById.restore();
				sinon.stub(fdaAdapter, 'getFoodRecallById', function () {
					return Promise.reject(response);
				});

				request(app)
					.get('/api/recalls/ad123e121')
					.expect(response.statusCode)
					.expect(error)
					.expect(function () {
						assert(fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was not called to process the response.');
					})
					.end(done);
			});

			it('should return a 409 when the adapter returns a rejected promise (string)', function (done) {

				// re-define the stub to return a rejected promise
				fdaAdapter.getFoodRecallById.restore();
				sinon.stub(fdaAdapter, 'getFoodRecallById', function () {
					return Promise.reject('just a string');
				});

				request(app)
					.get('/api/recalls/12easc2123')
					.expect(500)
					.expect({
						error: {
							code: 'INTERNAL_ERROR',
							message: 'An unknown error occurred.'
						}
					})
					.expect(function () {
						assert(fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was not called to process the response.');
					})
					.end(done);
			});

			it('should return a 409 when the adapter returns a rejected promise (null)', function (done) {

				// re-define the stub to return a rejected promise
				fdaAdapter.getFoodRecallById.restore();
				sinon.stub(fdaAdapter, 'getFoodRecallById', function () {
					return Promise.reject(null);
				});

				request(app)
					.get('/api/recalls/asf12eas2')
					.expect(500)
					.expect({
						error: {
							code: 'INTERNAL_ERROR',
							message: 'An unknown error occurred.'
						}
					})
					.expect(function () {
						assert(fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was not called to process the response.');
					})
					.end(done);
			});

		});

		describe('getRecalls', function () {

			beforeEach(function () {
				sinon.stub(fdaAdapter, 'searchFoodRecalls').returns(Promise.resolve(EMPTY_RECALL_RESULT));
			});

			afterEach(function () {
				fdaAdapter.searchFoodRecalls.restore();
			});

			it('should succeed', function (done) {
				request(app)
					.get('/api/recalls')
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({}), 'searchFoodRecalls was not called with empty parameters.');
					})
					.end(done);
			});

			it('should return a 409 when state is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ state: 'OF MIND' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid state'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid state', function (done) {
				var state = 'VA';

				request(app)
					.get('/api/recalls')
					.query({ state: state })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ state: state }), 'searchFoodRecalls was not called with the state.');
					})
					.end(done);
			});

			it('should return a 409 when eventid is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ eventid: 'Warped Tour' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid eventid'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid eventid', function (done) {
				var eventid = 123456;

				request(app)
					.get('/api/recalls')
					.query({ eventid: eventid })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ eventid: eventid }), 'searchFoodRecalls was not called with the event ID.');
					})
					.end(done);
			});

			it('should succeed with a firmname', function (done) {
				var firmname = 'ACME';

				request(app)
					.get('/api/recalls')
					.query({ firmname: firmname })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ firmname: firmname }), 'searchFoodRecalls was not called with the firmname.');
					})
					.end(done);
			});

			it('should return a 409 when from is invalid', function (done) {
				// `from` and `to` are both required when one is provided
				request(app)
					.get('/api/recalls')
					.query({ from: 'a long time ago', to: 200000 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid from'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when to is invalid', function (done) {
				// `from` and `to` are both required when one is provided
				request(app)
					.get('/api/recalls')
					.query({ from: 100000, to: 'far into the future' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid to'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when from is greater than to', function (done) {
				// `from` and `to` are both required when one is provided
				request(app)
					.get('/api/recalls')
					.query({ from: 200000, to: 100000 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid from/to - from must be before to'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid to and from', function (done) {
				var from = 100000,
					to = 200000;

				request(app)
					.get('/api/recalls')
					.query({ from: from, to: to })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ from: from, to: to }), 'searchFoodRecalls was not called with the from.');
					})
					.end(done);
			});

			it('should return a 409 when classificationlevels is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ classificationlevels: ',' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid classificationlevels'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			_.each([0, 4], function (level) {
				it('should return a 409 when classificationlevels is out of range (' + level + ')', function (done) {
					request(app)
						.get('/api/recalls')
						.query({ classificationlevels: level })
						.expect(409)
						.expect(_createInvalidArgumentResponse('Invalid classificationlevels - must be 1, 2, or 3'))
						.expect(function () {
							assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
						})
						.end(done);
				});
			});

			it('should succeed with valid classificationlevels', function (done) {
				var classificationlevels = '1,2,3',
					classificationlevelsParsed = [1, 2, 3];

				request(app)
					.get('/api/recalls')
					.query({ classificationlevels: classificationlevels })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ classificationlevels: classificationlevelsParsed }), 'searchFoodRecalls was not called with the classificationlevels.');
					})
					.end(done);
			});

			it('should succeed with classificationlevels provided as multiple query parameters', function (done) {
				var classificationlevelsParsed = [1, 2, 3];

				request(app)
					.get('/api/recalls')
					.query({
						'classificationlevels[0]': 1,
						'classificationlevels[1]': 2,
						'classificationlevels[2]': 3
					})
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ classificationlevels: classificationlevelsParsed }), 'searchFoodRecalls was not called with the classificationlevels.');
					})
					.end(done);
			});

			it('should return a 409 when keywords is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ keywords: 'clogs' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid keywords - could not match keyword clogs'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with valid keywords', function (done) {
				var keywords = ['dairy', 'dye', 'egg', 'fish', 'gluten', 'nut', 'soy'];

				request(app)
					.get('/api/recalls')
					.query({ keywords: keywords.join(',') })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ keywords: keywords }), 'searchFoodRecalls was not called with the keywords.');
					})
					.end(done);
			});

			it('should succeed with keywords provided as multiple query parameters', function (done) {
				var keywordsParsed = ['dye', 'egg'];

				request(app)
					.get('/api/recalls')
					.query({
						'keywords[0]': 'dye',
						'keywords[1]': 'egg'
					})
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ keywords: keywordsParsed }), 'searchFoodRecalls was not called with the keywords.');
					})
					.end(done);
			});

			it('should return a 409 when skip is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ skip: 'a few' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid skip'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid skip', function (done) {
				var skip = 123456;

				request(app)
					.get('/api/recalls')
					.query({ skip: skip })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ skip: skip }), 'searchFoodRecalls was not called with the skip.');
					})
					.end(done);
			});

			it('should return a 409 when limit is invalid', function (done) {
				request(app)
					.get('/api/recalls')
					.query({ limit: 'a few' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid limit'))
					.expect(function () {
						assert(!fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid limit', function (done) {
				var limit = 123456;

				request(app)
					.get('/api/recalls')
					.query({ limit: limit })
					.expect(200)
					.expect(EMPTY_RECALL_RESULT)
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({ limit: limit }), 'searchFoodRecalls was not called with the skip.');
					})
					.end(done);
			});

		});

		describe('getRecallsCounts', function () {

			beforeEach(function () {
				sinon.stub(fdaAdapter, 'getFoodRecallsCounts').returns(Promise.resolve(EMPTY_COUNT_RESULT));
			});

			afterEach(function () {
				fdaAdapter.getFoodRecallsCounts.restore();
			});

			it('should return a 409 when field is invalid', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'somethingsilly' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid field'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid field', function (done) {
				var field = 'classification';

				request(app)
					.get('/api/counts/recalls')
					.query({ field: field })
					.expect(200)
					.expect(EMPTY_COUNT_RESULT)
					.expect(function () {
						assert(fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was not called on the FDA adapter.');
						assert(fdaAdapter.getFoodRecallsCounts.calledWith({ field: field }), 'getFoodRecallsCounts was not called with the state.');
					})
					.end(done);
			});

			it('should return a 409 when state is invalid', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'classification', state: 'OF MIND' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid state'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid state', function (done) {
				var state = 'VA';

				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'classification', state: state })
					.expect(200)
					.expect(EMPTY_COUNT_RESULT)
					.expect(function () {
						assert(fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was not called on the FDA adapter.');
						assert(fdaAdapter.getFoodRecallsCounts.calledWith({ field: 'classification', state: state }), 'getFoodRecallsCounts was not called with the state.');
					})
					.end(done);
			});

			it('should return a 409 when status is invalid', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'classification', status: 'OF MIND' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid status'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			_.each(['ongoing', 'completed', 'terminated', 'pending'], function (status) {
				it('should succeed with a valid status (' + status + ')', function (done) {
					request(app)
						.get('/api/counts/recalls')
						.query({ field: 'classification', status: status })
						.expect(200)
						.expect(EMPTY_COUNT_RESULT)
						.expect(function () {
							assert(fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was not called on the FDA adapter.');
							assert(fdaAdapter.getFoodRecallsCounts.calledWith({ field: 'classification', status: status }), 'getFoodRecallsCounts was not called with the status.');
						})
						.end(done);
				});
			});

			it('should return a 409 when skip is provided', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'classification', skip: 1 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid skip - not allowed'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when limit is provided', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.query({ field: 'classification', limit: 1 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid limit - not allowed'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

		});

	});

};