'use strict';

var path = require('path'),
	chai = require('chai'),
	sinon = require('sinon'),
	mongoAdpt = require(path.join(global.__adptsdir, 'mongo')),
	commentsModel = require(path.join(global.__modelsdir, 'comments'));

var assert = chai.assert;

module.exports = function () {

	describe('mongo', function () {

		var _getDummyComment = function () {
				return {
					__v: 1,
					_id: 39429230843,
					recallnumber: 'F-123-2014',
					name: 'Indiana Jones',
					location: 'CA',
					comment: 'Snakes. Why did it have to be snakes?'
				};
			},
			_getDummyMongoCommentObj = function () {
				return {
					toObject: _getDummyComment,
					created: '2015-06-25T15:16:50.398Z'
				};
			},
			_getDummyComments = function () {
				return [
					_getDummyMongoCommentObj()
				];
			},
			_getMockComment = function () {
				var params = {
						create: null,
						find: null,
						sort: null
					},
					myobj = {
						get params() {
							return params;
						},
						create: function (obj) {
							params.create = obj;
							return _getDummyMongoCommentObj();
						},
						find: function (obj) {
							params.find = obj;
							return myobj;
						},
						sort: function (obj) {
							params.sort = obj;
							return myobj;
						},
						exec: _getDummyComments
					};
				return myobj;
			},
			createdChecksum = 1435245410;

		describe('getComments', function () {

			afterEach(function () {
				commentsModel.find.restore();
			});

			it('should return a valid array of comments object', function (done) {
				var mockComment = _getMockComment(),
					recallnumbers = ['F-0123-2014'];

				sinon.stub(commentsModel, 'find', mockComment.find);

				mongoAdpt.getComments(recallnumbers).then(function (comments) {
					// find called with
					assert.isObject(mockComment.params.find, 'getComments did not submit an object to find');
					assert.deepEqual(mockComment.params.find, {
						recallnumber: { $in: recallnumbers }
					}, 'getComments did not submit a valid object to find');

					// sort called with
					assert.isObject(mockComment.params.sort, 'getComments did not submit an object to sort');
					assert.deepEqual(mockComment.params.sort, { created: -1 }, 'getComments did not submit a valid object to sort');

					assert.isArray(comments, 'getComments did not return an array');
					assert.equal(comments.length, 1, 'getComments did not return an array with one element');
					var comment = comments[0],
						testcomment = _getDummyComment();
					testcomment.created = createdChecksum;
					assert.deepEqual(comment, testcomment, 'getComments did not generate the correct output');

					done();
				}).catch(function (err) {
					done(err);
				}).done();
			});

			it('should return an error when the mongo fetch fails', function (done) {

				sinon.stub(commentsModel, 'find', function () {
					throw new Error('test');
				});

				mongoAdpt.getComments(null).then(function () {
					done(new Error('getComments returned successfully when an error was thrown'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'getComments did not return an error');
					assert.equal(err.message, 'Failed to get comments', 'getComments did not return the correct message');

					done();
				}).done();
			});

		});

		describe('addComment', function () {
			var inputObj = {
					recallnumber: '1800test',
					name: 'Bananaphone',
					location: 'Somewhere',
					comment: 'This is silly'
				};

			afterEach(function () {
				commentsModel.create.restore();
			});

			it('should return a valid array of comments object', function (done) {
				var mockComment = _getMockComment();

				sinon.stub(commentsModel, 'create', mockComment.create);

				mongoAdpt.addComment(inputObj).then(function (comment) {
					// create called with
					assert.isObject(mockComment.params.create, 'addComment did not submit an object to create');
					assert.deepEqual(mockComment.params.create, inputObj, 'addComment did not submit a valid object to create');

					assert.isObject(comment, 'addComment did not return an object');
					var testcomment = _getDummyComment();
					testcomment.created = createdChecksum;
					assert.deepEqual(comment, testcomment, 'addComment did not generate the correct output');

					done();
				}).catch(function (err) {
					done(err);
				}).done();
			});

			it('should return an error when the mongo fetch fails', function (done) {

				sinon.stub(commentsModel, 'create', function () {
					throw new Error('test');
				});

				mongoAdpt.addComment(inputObj).then(function () {
					done(new Error('addComment returned successfully when an error was thrown'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'addComment did not return an error');
					assert.equal(err.message, 'Failed to add comment', 'addComment did not return the correct message');

					done();
				}).done();
			});

		});

	});

};