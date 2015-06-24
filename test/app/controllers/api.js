'use strict';

var path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	chai = require('chai'),
	sinon = require('sinon'),
	request = require('supertest'),
	Promise = require('bluebird'),
	commentsDal = require(path.join(global.__dalsdir, 'comments')),
	recallsDal = require(path.join(global.__dalsdir, 'recalls'));

var app = express(),
	assert = chai.assert,
	reqSession = {};

// Initialize the express app.
app.use(bodyParser.json());
app.use(function (req, res, next) {
	// Mock a session object that we can configure via `reqSession`.
	Object.defineProperty(req, 'session', {
		get: function () {
			return reqSession;
		},
		enumerable: true
	});

	next();
});

// Populate the Express routes.
require(path.join(global.__routedir, 'api'))(app);

function _createErrorResponse (message, code) {
	code = code || 'INVALID_ARGUMENT';

	return {
		error: {
			code: code,
			message: message
		}
	};
}

module.exports = function () {

	describe('API', function () {

		var EMPTY_RECALLS_RESULT = {
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
				sinon.stub(recallsDal, 'getById').returns(Promise.resolve(EMPTY_RECALLS_RESULT));
			});

			afterEach(function () {
				recallsDal.getById.restore();
			});

			it('should succeed', function (done) {
				var recallId = '0123456798abcdef';

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						assert(recallsDal.getById.called, 'recallsDal.getById was not called.');
						assert(recallsDal.getById.calledWith({ id: recallId }), 'recallsDal.getById was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 409 when the DAL rejects with an Error with a type of INVALID_ARGUMENT', function (done) {

				var recallId = '0123456798abcdef',
					message = 'something terrible happened',
					type = 'INVALID_ARGUMENT';

				// re-define the stub to return a rejected promise
				recallsDal.getById.restore();
				sinon.stub(recallsDal, 'getById', function () {
					var err = new Error(message);
					err.type = type;
					return Promise.reject(err);
				});

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(409)
					.expect(_createErrorResponse(message, type))
					.expect(function () {
						assert(recallsDal.getById.called, 'recallsDal.getById was not called.');
						assert(recallsDal.getById.calledWith({ id: recallId }), 'recallsDal.getById was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 404 when the DAL rejects with an Error with a type of NOT_FOUND', function (done) {

				var recallId = '0123456798abcdef',
					message = 'something terrible happened',
					type = 'NOT_FOUND';

				// re-define the stub to return a rejected promise
				recallsDal.getById.restore();
				sinon.stub(recallsDal, 'getById', function () {
					var err = new Error(message);
					err.type = type;
					return Promise.reject(err);
				});

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(404)
					.expect(_createErrorResponse(message, type))
					.expect(function () {
						assert(recallsDal.getById.called, 'recallsDal.getById was not called.');
						assert(recallsDal.getById.calledWith({ id: recallId }), 'recallsDal.getById was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 500 when the DAL rejects with a string', function (done) {

				var recallId = '0123456798abcdef';

				// re-define the stub to return a rejected promise
				recallsDal.getById.restore();
				sinon.stub(recallsDal, 'getById', function () {
					return Promise.reject('just a string');
				});

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(500)
					.expect({
						error: {
							code: 'INTERNAL_ERROR',
							message: 'An unknown error occurred.'
						}
					})
					.expect(function () {
						assert(recallsDal.getById.called, 'recallsDal.getById was not called.');
						assert(recallsDal.getById.calledWith({ id: recallId }), 'recallsDal.getById was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 500 when the DAL rejects with nothing', function (done) {

				var recallId = '0123456798abcdef';

				// re-define the stub to return a rejected promise
				recallsDal.getById.restore();
				sinon.stub(recallsDal, 'getById', function () {
					return Promise.reject();
				});

				request(app)
					.get('/api/recalls/' + recallId)
					.expect(500)
					.expect({
						error: {
							code: 'INTERNAL_ERROR',
							message: 'An unknown error occurred.'
						}
					})
					.expect(function () {
						assert(recallsDal.getById.called, 'recallsDal.getById was not called.');
						assert(recallsDal.getById.calledWith({ id: recallId }), 'recallsDal.getById was not called with the expected parameters.');
					})
					.end(done);
			});

		});

		describe('getRecalls', function () {

			function _createRecallsDalInput() {
				return {
					firmname: undefined,
					from: NaN,
					to: NaN,
					state: undefined,
					eventid: NaN,
					skip: NaN,
					limit: NaN
				};
			}

			beforeEach(function () {
				sinon.stub(recallsDal, 'search').returns(Promise.resolve(EMPTY_RECALLS_RESULT));
			});

			afterEach(function () {
				recallsDal.search.restore();
			});

			it('should succeed', function (done) {
				request(app)
					.get('/api/recalls')
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(_createRecallsDalInput()), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 409 when the DAL rejects with an Error with a type of INVALID_ARGUMENT', function (done) {

				var message = 'something terrible happened',
					type = 'INVALID_ARGUMENT';

				// re-define the stub to return a rejected promise
				recallsDal.search.restore();
				sinon.stub(recallsDal, 'search', function () {
					var err = new Error(message);
					err.type = type;
					return Promise.reject(err);
				});

				request(app)
					.get('/api/recalls')
					.expect(409)
					.expect(_createErrorResponse(message, type))
					.expect(function () {
						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(_createRecallsDalInput()), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should parse classificationlevels provided as a comma-delimited string', function (done) {
				request(app)
					.get('/api/recalls')
					.query({classificationlevels: '1,2,3'})
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						var params = _createRecallsDalInput();

						params.classificationlevels = [1, 2, 3];

						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(params), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should parse classificationlevels provided as multiple query parameters', function (done) {
				request(app)
					.get('/api/recalls')
					.query({
						'classificationlevels[0]': 1,
						'classificationlevels[1]': 2,
						'classificationlevels[2]': 3
					})
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						var params = _createRecallsDalInput();

						params.classificationlevels = [1, 2, 3];

						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(params), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should exclude classificationlevels that are not numbers', function (done) {
				request(app)
					.get('/api/recalls')
					.query({classificationlevels: '1,dogs,3'})
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						var params = _createRecallsDalInput();

						params.classificationlevels = [1, 3];

						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(params), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should parse keywords provided as a comma-delimited string', function (done) {
				var keywords = ['one', 'two', 'three'];

				request(app)
					.get('/api/recalls')
					.query({keywords: keywords.join(',')})
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						var params = _createRecallsDalInput();

						params.keywords = keywords;

						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(params), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should succeed with keywords provided as multiple query parameters', function (done) {
				var keywords = ['one', 'two', 'three'];

				request(app)
					.get('/api/recalls')
					.query({
						'keywords[0]': keywords[0],
						'keywords[1]': keywords[1],
						'keywords[3]': keywords[2]
					})
					.expect(200)
					.expect(EMPTY_RECALLS_RESULT)
					.expect(function () {
						var params = _createRecallsDalInput();

						params.keywords = keywords;

						assert(recallsDal.search.called, 'recallsDal.search was not called.');
						assert(recallsDal.search.calledWith(params), 'recallsDal.search was not called with the expected parameters.');
					})
					.end(done);
			});

		});

		describe('getRecallsCounts', function () {

			function _createRecallsDalInput() {
				return {
					field: undefined,
					state: undefined,
					status: undefined
				};
			}

			beforeEach(function () {
				sinon.stub(recallsDal, 'getCounts').returns(Promise.resolve(EMPTY_COUNT_RESULT));
			});

			afterEach(function () {
				recallsDal.getCounts.restore();
			});

			it('should succeed', function (done) {
				request(app)
					.get('/api/counts/recalls')
					.expect(200)
					.expect(EMPTY_COUNT_RESULT)
					.expect(function () {
						assert(recallsDal.getCounts.called, 'recallsDal.getCounts was not called.');
						assert(recallsDal.getCounts.calledWith(_createRecallsDalInput()), 'recallsDal.getCounts was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 409 when the DAL rejects with an Error with a type of INVALID_ARGUMENT', function (done) {

				var message = 'something terrible happened',
					type = 'INVALID_ARGUMENT';

				// re-define the stub to return a rejected promise
				recallsDal.getCounts.restore();
				sinon.stub(recallsDal, 'getCounts', function () {
					var err = new Error(message);
					err.type = type;
					return Promise.reject(err);
				});

				request(app)
					.get('/api/counts/recalls')
					.expect(409)
					.expect(_createErrorResponse(message, type))
					.expect(function () {
						assert(recallsDal.getCounts.called, 'recallsDal.getCounts was not called.');
						assert(recallsDal.getCounts.calledWith(_createRecallsDalInput()), 'recallsDal.getCounts was not called with the expected parameters.');
					})
					.end(done);
			});

		});

		describe('addCommentForRecall', function () {

			function _createCommentsDalInput() {
				return {
					recallnumber: undefined,
					name: undefined,
					location: undefined,
					comment: undefined
				};
			}

			beforeEach(function () {
				sinon.stub(commentsDal, 'add').returns(Promise.resolve({}));
				// Create the mock preferences object.
				reqSession.preferences = {};
			});

			afterEach(function () {
				commentsDal.add.restore();
				delete reqSession.preferences;
			});

			it('should succeed', function (done) {
				var location = 'VA';

				request(app)
					.put('/api/comments')
					.send({ location: location })
					.expect(200)
					.expect({})
					.expect(function () {
						var params = _createCommentsDalInput();

						params.location = location;

						assert(commentsDal.add.called, 'commentsDal.add was not called.');
						assert(commentsDal.add.calledWith(params), 'commentsDal.add was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should use the state from preferences when location is not provided', function (done) {
				var location = 'WV';

				reqSession.preferences.state = location;

				request(app)
					.put('/api/comments')
					.expect(200)
					.expect({})
					.expect(function () {
						var params = _createCommentsDalInput();

						params.location = location;

						assert(commentsDal.add.called, 'commentsDal.add was not called.');
						assert(commentsDal.add.calledWith(params), 'commentsDal.add was not called with the expected parameters.');
					})
					.end(done);
			});

			it('should return a 409 when the DAL rejects with an Error with a type of INVALID_ARGUMENT', function (done) {

				var location = 'VA',
					message = 'something terrible happened',
					type = 'INVALID_ARGUMENT';

				// re-define the stub to return a rejected promise
				commentsDal.add.restore();
				sinon.stub(commentsDal, 'add', function () {
					var err = new Error(message);
					err.type = type;
					return Promise.reject(err);
				});

				request(app)
					.put('/api/comments')
					.send({location: location})
					.expect(409)
					.expect(_createErrorResponse(message, type))
					.expect(function () {
						var params = _createCommentsDalInput();

						params.location = location;

						assert(commentsDal.add.called, 'commentsDal.add was not called.');
						assert(commentsDal.add.calledWith(params), 'commentsDal.add was not called with the expected parameters.');
					})
					.end(done);
			});

		});

	});

};