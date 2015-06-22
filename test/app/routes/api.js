'use strict';

var path = require('path'),
	express = require('express'),
	chai = require('chai'),
	sinon = require('sinon'),
	request = require('supertest'),
	apiCtrl = require(path.join(global.__ctrldir, 'api'));

var app = express(),
	assert = chai.assert;

module.exports = function (common) {

	describe('/api', function() {

		before(function () {
			sinon.stub(apiCtrl, 'getRecallById', common.endHandler);
			sinon.stub(apiCtrl, 'getRecalls', common.endHandler);
			sinon.stub(apiCtrl, 'getRecallsCounts', common.endHandler);

			// The routes must be registered AFTER the controller methods are stubbed, as Express holds a
			//  reference to the route handlers. Changing them in the require cache after the routes are
			//  registered will have no effect.
			require(path.join(global.__routedir, 'api'))(app);
		});

		after(function () {
			apiCtrl.getRecallById.restore();
			apiCtrl.getRecalls.restore();
			apiCtrl.getRecallsCounts.restore();
		});

		describe('/recalls/:id', function () {

			it('should call getRecallById on the API controller', function (done) {

				request(app)
					.get('/api/recalls/F-1234-4678')
					.expect(function () {
						assert(apiCtrl.getRecallById.called, 'getRecallById was not called on the API controller');
					})
					.end(done);
			});

		});

		describe('/recalls', function () {

			it('should call getRecalls on the API controller', function (done) {

				request(app)
					.get('/api/recalls')
					.expect(function () {
						assert(apiCtrl.getRecalls.called, 'getRecalls was not called on the API controller');
					})
					.end(done);
			});

		});

		describe('/recalls/counts', function () {

			it('should call getRecallsCounts on the API controller', function (done) {

				request(app)
					.get('/api/recalls/counts')
					.expect(function () {
						assert(apiCtrl.getRecallsCounts.called, 'getRecallsCounts was not called on the API controller');
					})
					.end(done);
			});

		});

	});

};