'use strict';

var path = require('path'),
	_ = require('underscore'),
	chai = require('chai'),
	sinon = require('sinon'),
	Promise = require('bluebird'),
	commentsDal = require(path.join(global.__dalsdir, 'comments')),
	errorHelper = require(path.join(global.__libdir, 'errorHelper')),
	recallHelper = require(path.join(global.__libdir, 'recallHelper')),
	mongoAdapter = require(path.join(global.__adptsdir, 'mongo'));

var assert = chai.assert;

module.exports = function () {

	describe('comments', function () {

		describe('add', function () {

			function _getDummyComment() {
				return {
					__v: 1,
					_id: 39429230843,
					recallnumber: 'F-123-2014',
					name: 'Indiana Jones',
					location: 'CA',
					comment: 'Snakes. Why did it have to be snakes?'
				};
			}

			beforeEach(function () {
				sinon.stub(errorHelper, 'getValidationError', function (message) {
					return new Error(message);
				});
				sinon.stub(recallHelper, 'isValidState').returns(true);
			});

			afterEach(function () {
				mongoAdapter.addComment.restore();
				errorHelper.getValidationError.restore();
				recallHelper.isValidState.restore();
			});

			it('should succeed with valid inputs (no location)', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				delete input.location;
				delete adapterOutput.location;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function (comment) {
					assert(!errorHelper.getValidationError.called, 'errorHelper.getValidationError was called when there was no error');
					assert(!recallHelper.isValidState.called, 'recallHelper.isValidState was called when no state was provided');

					var adapterInput = _.omit(input, '__v', '_id');

					// an empty location will be added
					adapterInput.location = undefined;

					assert(mongoAdapter.addComment.calledWith(adapterInput), 'mongoAdapter.addComment was not called with expected parameters');

					assert.deepEqual(comment, _.omit(input, '__v', '_id', 'recallnumber'), 'add did not remove the expected properties');

					done();
				}).catch(function (err) {
					done(err);
				}).done();
			});

			it('should succeed with valid inputs (with location)', function (done) {
				var expected = _getDummyComment(),
					adapterOutput = _getDummyComment();

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(expected).then(function (comment) {
					assert(!errorHelper.getValidationError.called, 'errorHelper.getValidationError was called when there was no error');
					assert(recallHelper.isValidState.called, 'recallHelper.isValidState was not called when a state was provided');
					assert(recallHelper.isValidState.calledWith(expected.location), 'recallHelper.isValidState was not called with the expected state');

					assert(mongoAdapter.addComment.calledWith(_.omit(expected, '__v', '_id')), 'mongoAdapter.addComment was not called with expected parameters');

					assert.deepEqual(comment, _.omit(expected, '__v', '_id', 'recallnumber'), 'add did not remove the expected properties');

					done();
				}).catch(function (err) {
					done(err);
				}).done();
			});

			it('should fail with an invalid recallnumber', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				input.recallnumber = 1234;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid recallnumber', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail without a recallnumber', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				delete input.recallnumber;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid recallnumber', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail with an invalid name', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				input.name = 1234;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid name', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail without a name', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				delete input.name;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid name', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail with an invalid location (not a string)', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				input.location = 1234;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid location', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail with an invalid location (not a US state)', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				input.location = 'Gretta Garbo';

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));
				// change isValidState to return false for this test
				recallHelper.isValidState.restore();
				sinon.stub(recallHelper, 'isValidState').returns(false);

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid location; it must be a valid state', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail with an invalid comment', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				input.comment = 1234;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid comment', 'The expected error message was not returned');

					done();
				}).done();
			});

			it('should fail without a comment', function (done) {
				var input = _getDummyComment(),
					adapterOutput = _getDummyComment();

				delete input.comment;

				sinon.stub(mongoAdapter, 'addComment').returns(Promise.resolve(adapterOutput));

				commentsDal.add(input).then(function () {
					done(new Error('add was expected to throw an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called to create the error');

					assert.equal(err.message, 'Invalid comment', 'The expected error message was not returned');

					done();
				}).done();
			});

		});

	});

};