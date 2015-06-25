'use strict';

var path = require('path'),
	_ = require('underscore'),
	chai = require('chai'),
	sinon = require('sinon'),
	Promise = require('bluebird'),
	recallsDal = require(path.join(global.__dalsdir, 'recalls')),
	errorHelper = require(path.join(global.__libdir, 'errorHelper')),
	validationHelper = require(path.join(global.__libdir, 'validationHelper')),
	mongoAdapter = require(path.join(global.__adptsdir, 'mongo')),
	fdaAdapter = require(path.join(global.__adptsdir, 'fda'));

var assert = chai.assert;

module.exports = function () {

	var recallId = 'Ri0xNjY4LTIwMTMLNjUzOTILMjAxMzA2MDQLMDcwMjA3MDAwMTEwK251dHJpdGlvbmFsK3BhY2thZ2UrcGxhc3RpYythbG1vbmQrc2xpY2Vk';

	function _getFDAAPIFoodRecallFormattedObject() {
		return {
			"recall_number": "F-123-2014",
			"reason_for_recall": "Contamination with Listeria monocytogenes, an organism which can cause serious and sometimes fatal infections in young children, frail or elderly people, and others with weakened immune systems. Although healthy individuals may suffer only short-term symptoms such as high fever, severe headache, stiffness, nausea, abdominal pain and diarrhea, Listeria infection can cause miscarriages and stillbirths among pregnant women.",
			"status": "Ongoing",
			"distribution_pattern": "Ohio, Michigan, West Virginia, Kentucky, Tennessee, Pennsylvania, Wisconsin, Illinois, and Indiana.",
			"product_quantity": "85 cases",
			"recall_initiation_date": 1370304000,
			"state": "MI",
			"event_id": 65392,
			"product_type": "Food",
			"product_description": "Item Number: 193061\\\nItem Description: BAG CLR ALMOND SLICED RAW PP\\\nCase Pack: 12\\\nPackage Size: 9 OZ Clear Plastic Bag (Pic-A-Nut Label on Front, Nutritional Label on Back)\\\nUPC Number: 070207000110",
			"country": "US",
			"city": "Warren",
			"recalling_firm": "Lipari Foods, Inc.",
			"report_date": 1374019200,
			"voluntary_mandated": "Voluntary: Firm Initiated",
			"classification": "Class I",
			"code_info": "Lot Numbers: 08201304, 23201305, 03201306\\\nBest By Dates: 4/8/2014, 5/23/2014, 6/3/2014",
			"initial_firm_notification": "Two or more of the following: Email, Fax, Letter, Press Release, Telephone, Visit",
			"id": recallId,
			"classificationlevel": 1,
			"mandated": false,
			"affectedstates": ["IL", "IN", "KY", "MI", "OH", "PA", "TN", "VA", "WI", "WV"],
			"affectednationally": false,
			"categories": ["nut"],
			"openfda_id": "001c53c26771d44403438a3dbee65958357f69ad6bcf75e16bd1bc0eb6245e42"
		};
	}

	function _getComment() {
		return {
			__v: 1,
			_id: 39429230843,
			recallnumber: 'F-123-2014',
			name: 'Indiana Jones',
			location: 'CA',
			comment: 'Snakes. Why did it have to be snakes?',
			created: 12345647
		};
	}

	function _getFDAAPICountFormattedResponse() {
		return {
			total: 8016,
			counts: {
				'Class I': 3767,
				'Class II': 3978,
				'Class III': 271
			}
		};
	}

	describe('recalls', function () {

		beforeEach(function () {
			sinon.stub(errorHelper, 'getValidationError', function (message) {
				return new Error(message);
			});
			sinon.stub(validationHelper, 'isBase64String').returns(true);
			sinon.stub(mongoAdapter, 'getComments').returns(Promise.resolve([_getComment()]));
		});

		afterEach(function () {
			errorHelper.getValidationError.restore();
			validationHelper.isBase64String.restore();
			mongoAdapter.getComments.restore();
		});

		describe('getById', function () {

			afterEach(function () {
				fdaAdapter.getFoodRecallById.restore();
			});

			it('should succeed with valid parameters', function (done) {
				var recall = _getFDAAPIFoodRecallFormattedObject();

				sinon.stub(fdaAdapter, 'getFoodRecallById').returns(Promise.resolve(recall));

				recallsDal.getById({
					id: recallId
				}).then(function (result) {
					assert(!errorHelper.getValidationError.called, 'errorHelper.getValidationError was called when there was no error');
					assert(validationHelper.isBase64String.called, 'validationHelper.isBase64String was not called to validate the ID');

					assert(fdaAdapter.getFoodRecallById.called, 'fdaAdapter.getFoodRecallById was not called to get the recall');
					assert(fdaAdapter.getFoodRecallById.calledWith({ id: recallId }), 'fdaAdapter.getFoodRecallById was not passed the recall ID');

					assert(mongoAdapter.getComments.called, 'mongoAdapter.getComments was not called to fetch the recall comments');
					assert(mongoAdapter.getComments.calledWith([recall.recall_number]), 'mongoAdapter.getComments was not passed the recall number');

					// the result should be the recall returned by the FDA adapter plus the comments returned by the mongo adapter
					var expected = recall,
						comment = _getComment();

					_.omit(comment, '__v', '_id', 'recallnumber');

					expected.comments = [comment];

					assert.deepEqual(result, expected, 'The recall did not match the expected results');

					done();
				}).catch(function (err) {
					done(err);
				}).done();

			});

		});

		describe('getCounts', function () {

			afterEach(function () {
				fdaAdapter.getFoodRecallsCounts.restore();
			});

			it('should succeed with valid parameters', function (done) {
				var recall = _getFDAAPICountFormattedResponse(),
					obj = {
						state: 'va',
						status: 'ongoing',
						field: 'classification'
					};

				sinon.stub(fdaAdapter, 'getFoodRecallsCounts').returns(Promise.resolve(recall));

				recallsDal.getCounts(obj).then(function (result) {
					assert(!errorHelper.getValidationError.called, 'errorHelper.getValidationError was called when there was no error');

					assert(fdaAdapter.getFoodRecallsCounts.called, 'fdaAdapter.getFoodRecallsCounts was not called to get the recall');
					assert(fdaAdapter.getFoodRecallsCounts.calledWith(obj), 'fdaAdapter.getFoodRecallsCounts was not passed the recall ID');

					assert.deepEqual(result, recall, 'fdaAdapter.getFoodRecallsCounts did not return the correct object');

					done();
				}).catch(function (err) {
					done(err);
				}).done();

			});

			it('should return an error when passed an invalid field', function (done) {
				var recall = _getFDAAPICountFormattedResponse(),
					obj = {
						field: 'test'
					};

				sinon.stub(fdaAdapter, 'getFoodRecallsCounts').returns(Promise.resolve(recall));

				recallsDal.getCounts(obj).then(function () {
					done(new Error('getFoodRecallsCounts successfully returned when there was an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called when there was an error');
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.equal(err.message, 'Invalid field', 'getFoodRecallsCounts did not return the correct message');

					done();
				}).done();

			});

			it('should return an error when passed an invalid state', function (done) {
				var recall = _getFDAAPICountFormattedResponse(),
					obj = {
						field: 'classification',
						state: 'test'
					};

				sinon.stub(fdaAdapter, 'getFoodRecallsCounts').returns(Promise.resolve(recall));

				recallsDal.getCounts(obj).then(function () {
					done(new Error('getFoodRecallsCounts successfully returned when there was an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called when there was an error');
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.equal(err.message, 'Invalid state', 'getFoodRecallsCounts did not return the correct message');

					done();
				}).done();

			});

			it('should return an error when passed an invalid status', function (done) {
				var recall = _getFDAAPICountFormattedResponse(),
					obj = {
						field: 'classification',
						status: 'test'
					};

				sinon.stub(fdaAdapter, 'getFoodRecallsCounts').returns(Promise.resolve(recall));

				recallsDal.getCounts(obj).then(function () {
					done(new Error('getFoodRecallsCounts successfully returned when there was an error'));
				}).catch(function (err) {
					assert(errorHelper.getValidationError.called, 'errorHelper.getValidationError was not called when there was an error');
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.equal(err.message, 'Invalid status', 'getFoodRecallsCounts did not return the correct message');

					done();
				}).done();

			});

		});

	});

};