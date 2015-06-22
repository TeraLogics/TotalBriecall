'use strict';

var path = require('path'),
	express = require('express'),
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
					.get('/api/recalls/counts')
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
					.get('/api/recalls/counts')
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
					.get('/api/recalls/counts')
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
					.get('/api/recalls/counts')
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
					.get('/api/recalls/counts')
					.query({ field: 'classification', status: 'OF MIND' })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid status'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			it('should succeed with a valid status', function (done) {
				var status = 'ongoing';

				request(app)
					.get('/api/recalls/counts')
					.query({ field: 'classification', status: status })
					.expect(200)
					.expect(EMPTY_COUNT_RESULT)
					.expect(function () {
						assert(fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was not called on the FDA adapter.');
						assert(fdaAdapter.getFoodRecallsCounts.calledWith({ field: 'classification', status: status }), 'getFoodRecallsCounts was not called with the status.');
					})
					.end(done);
			});

			it('should return a 409 when skip is invalid', function (done) {
				request(app)
					.get('/api/recalls/counts')
					.query({ field: 'classification', skip: 1 })
					.expect(409)
					.expect(_createInvalidArgumentResponse('Invalid skip - not allowed'))
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallsCounts.called, 'getFoodRecallsCounts was called in an error case.');
					})
					.end(done);
			});

			it('should return a 409 when limit is invalid', function (done) {
				request(app)
					.get('/api/recalls/counts')
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