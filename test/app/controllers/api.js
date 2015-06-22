'use strict';

var path = require('path'),
	express = require('express'),
	chai = require('chai'),
	sinon = require('sinon'),
	request = require('supertest'),
	Promise = require('bluebird'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi')),
	FoodResult = require(path.join(global.__modelsdir, 'foodresult'));

var app = express(),
	assert = chai.assert;

// Populate the Express routes.
require(path.join(global.__routedir, 'api'))(app);

module.exports = function () {

	describe('API', function () {

		var EMPTY_RESULT = new FoodResult({
			meta: {
				results: {
					skip: 0,
					limit: 100,
					total: 1
				}
			},
			results: []
		});

		describe('getRecallById', function () {

			beforeEach(function () {
				sinon.stub(fdaAdapter, 'getFoodRecallById').returns(Promise.resolve(EMPTY_RESULT));
			});

			afterEach(function () {
				fdaAdapter.getFoodRecallById.restore();
			});

			it('should succeed', function (done) {
				var recallId = 'F-1234-5678';

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(200)
					.expect({
						skip: 0,
						limit: 100,
						total: 1,
						data: []
					})
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
					.expect({
						error: {
							code: 'INVALID_ARGUMENT',
							message: 'Invalid skip - not allowed'
						}
					})
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
					.expect({
						error: {
							code: 'INVALID_ARGUMENT',
							message: 'Invalid limit - not allowed'
						}
					})
					.expect(function () {
						assert(!fdaAdapter.getFoodRecallById.called, 'getFoodRecallById was called in an error case.');
					})
					.end(done);
			});

		});

		describe('getRecalls', function () {

			beforeEach(function () {
				sinon.stub(fdaAdapter, 'searchFoodRecalls').returns(Promise.resolve(EMPTY_RESULT));
			});

			afterEach(function () {
				fdaAdapter.searchFoodRecalls.restore();
			});

			it('should succeed', function (done) {
				request(app)
					.get('/api/recalls')
					.expect(200)
					.expect({
						skip: 0,
						limit: 100,
						total: 1,
						data: []
					})
					.expect(function () {
						assert(fdaAdapter.searchFoodRecalls.called, 'searchFoodRecalls was not called on the FDA adapter.');
						assert(fdaAdapter.searchFoodRecalls.calledWith({}), 'searchFoodRecalls was not called with empty parameters.');
					})
					.end(done);
			});

		});

	});

};