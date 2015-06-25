'use strict';

var _ = require('underscore'),
	path = require('path'),
	chai = require('chai'),
	Promise = require('bluebird'),
	request = require('request-promise'),
	sinon = require('sinon'),
	fdaAdpt = require(path.join(global.__adptsdir, 'fda')),
	recallHelper = require(path.join(global.__libdir, 'recallHelper'));

var assert = chai.assert;

module.exports = function () {

	describe.only('FDA', function () {

		var getFDAAPIFoodRecallObject = function () {
				return {
					"recall_number": "F-1668-2013",
					"reason_for_recall": "Contamination with Listeria monocytogenes, an organism which can cause serious and sometimes fatal infections in young children, frail or elderly people, and others with weakened immune systems. Although healthy individuals may suffer only short-term symptoms such as high fever, severe headache, stiffness, nausea, abdominal pain and diarrhea, Listeria infection can cause miscarriages and stillbirths among pregnant women.",
					"status": "Ongoing",
					"distribution_pattern": "Ohio, Michigan, West Virginia, Kentucky, Tennessee, Pennsylvania, Wisconsin, Illinois, and Indiana.",
					"product_quantity": "85 cases",
					"recall_initiation_date": "20130604",
					"state": "MI",
					"event_id": "65392",
					"product_type": "Food",
					"product_description": "Item Number: 193061\\\nItem Description: BAG CLR ALMOND SLICED RAW PP\\\nCase Pack: 12\\\nPackage Size: 9 OZ Clear Plastic Bag (Pic-A-Nut Label on Front, Nutritional Label on Back)\\\nUPC Number: 070207000110",
					"country": "US",
					"city": "Warren",
					"recalling_firm": "Lipari Foods, Inc.",
					"report_date": "20130717",
					"@epoch": 1424553174.836488,
					"voluntary_mandated": "Voluntary: Firm Initiated",
					"classification": "Class I",
					"code_info": "Lot Numbers: 08201304, 23201305, 03201306\\\nBest By Dates: 4/8/2014, 5/23/2014, 6/3/2014",
					"@id": "001c53c26771d44403438a3dbee65958357f69ad6bcf75e16bd1bc0eb6245e42",
					"openfda": {},
					"initial_firm_notification": "Two or more of the following: Email, Fax, Letter, Press Release, Telephone, Visit"
				};
			},
			getFDAAPIFoodRecallResponse = function () {
				var obj1 = getFDAAPIFoodRecallObject(),
					obj2 = getFDAAPIFoodRecallObject();

				obj2.distribution_pattern = 'nationwide';

				obj2.reason_for_recall = 'honey';

				return {
					"meta": {
						"disclaimer": "openFDA is a beta research project and not for clinical use. While we make every effort to ensure that data is accurate, you should assume all results are unvalidated.",
						"license": "http://open.fda.gov/license",
						"last_updated": "2015-05-31",
						"results": {
							"skip": 0,
							"limit": 2,
							"total": 3
						}
					},
					"results": [
						obj1,
						obj2
					]
				};
			},
			getFDAAPIFoodRecallFormattedObject = function () {
				return {
					"recall_number": "F-1668-2013",
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
					"id": "Ri0xNjY4LTIwMTMLNjUzOTILMjAxMzA2MDQLMDcwMjA3MDAwMTEwK251dHJpdGlvbmFsK3BhY2thZ2UrcGxhc3RpYythbG1vbmQrc2xpY2Vk",
					"classificationlevel": 1,
					"mandated": false,
					"affectedstates": ["IL", "IN", "KY", "MI", "OH", "PA", "TN", "VA", "WI", "WV"],
					"affectednationally": false,
					"categories": ["nut"],
					"openfda_id": "001c53c26771d44403438a3dbee65958357f69ad6bcf75e16bd1bc0eb6245e42"
				};
			},
			getFDAAPIFoodRecallFormattedResponse = function () {
				var obj1 = getFDAAPIFoodRecallFormattedObject(),
					obj2 = getFDAAPIFoodRecallFormattedObject();

				obj2.distribution_pattern = 'nationwide';
				obj2.affectedstates = _.keys(recallHelper.stateMappings).sort();
				obj2.affectednationally = true;

				obj2.reason_for_recall = 'honey';

				obj2.categories.unshift('spice');

				return {
					"skip": 0,
					"limit": 2,
					"total": 3,
					"data": [
						obj1,
						obj2
					]
				};
			},
			getFDAAPICountResponse = function () {
				return {
					"meta": {
						"disclaimer": "openFDA is a beta research project and not for clinical use. While we make every effort to ensure that data is accurate, you should assume all results are unvalidated.",
						"license": "http://open.fda.gov/license",
						"last_updated": "2015-05-31"
					},
					"results": [
						{
							"term": "Class I",
							"count": 3767
						},
						{
							"term": "Class II",
							"count": 3978
						},
						{
							"term": "Class III",
							"count": 271
						}
					]
				};
			};

		describe('getFoodRecallsCounts', function () {

			afterEach(function () {
				request.get.restore();
			});

			it('should return a valid stats object', function (done) {
				global.config.OPENFDA_APIKEY = 'test';
				sinon.stub(request, 'get', Promise.method(function () {
					return {
						body: getFDAAPICountResponse()
					};
				}));

				fdaAdpt.getFoodRecallsCounts({
					state: 'va',
					status: 'ongoing',
					field: 'classification'
				}).then(function (stats) {
					assert.isObject(stats, 'getFoodRecallsCounts did not return an object');
					assert.propertyVal(stats, 'total', 8016, 'getFoodRecallsCounts did not return a total');
					assert.property(stats, 'counts', 'getFoodRecallsCounts did not return a counts property');
					assert.isObject(stats.counts, 'getFoodRecallsCounts did not return a counts object');
					assert.propertyVal(stats.counts, 'Class I', 3767, 'getFoodRecallsCounts did not return a correct count for Class I');
					assert.propertyVal(stats.counts, 'Class II', 3978, 'getFoodRecallsCounts did not return a correct count for Class II');
					assert.propertyVal(stats.counts, 'Class III', 271, 'getFoodRecallsCounts did not return a correct count for Class III');

					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return a 409 error when the request fails with a 409', function (done) {
				var message = 'something bad',
					type = 'INVALID_ARGUMENT';

				sinon.stub(request, 'get', Promise.method(function () {
					return Promise.reject({
						statusCode: 409,
						error: {
							error: {
								message: message
							}
						}
					});
				}));

				fdaAdpt.getFoodRecallsCounts({
					field: 'classification'
				}).then(function () {
					done(new Error('getFoodRecallsCounts expected to get an error'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.property(err, 'type', 'getFoodRecallsCounts did not return an error with a type property');
					assert.equal(err.type, type, 'getFoodRecallsCounts did not return the correct type');
					assert.equal(err.message, message, 'getFoodRecallsCounts did not return the correct message');

					done();
				});
			});

			it('should return a 404 error when the request fails with a 404', function (done) {
				var message = 'this will not come back',
					message2 = 'No results found',
					type = 'NOT_FOUND';

				sinon.stub(request, 'get', Promise.method(function () {
					return Promise.reject({
						statusCode: 404,
						error: {
							error: {
								message: message
							}
						}
					});
				}));

				fdaAdpt.getFoodRecallsCounts({
					field: 'classification'
				}).then(function () {
					done(new Error('getFoodRecallsCounts expected to get an error'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.property(err, 'type', 'getFoodRecallsCounts did not return an error with a type property');
					assert.equal(err.type, type, 'getFoodRecallsCounts did not return the correct type');
					assert.equal(err.message, message2, 'getFoodRecallsCounts did not return the correct message');

					done();
				});
			});

			it('should return a 500 error when the request fails with a 500', function (done) {
				var message = 'something really bad';

				sinon.stub(request, 'get', Promise.method(function () {
					return Promise.reject({
						statusCode: 500,
						error: {
							error: {
								message: message
							}
						}
					});
				}));

				fdaAdpt.getFoodRecallsCounts({
					field: 'classification'
				}).then(function () {
					done(new Error('getFoodRecallsCounts expected to get an error'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'getFoodRecallsCounts did not return an error');
					assert.equal(err.message, message, 'getFoodRecallsCounts did not return the correct message');

					done();
				});
			});

		});

		describe('searchFoodRecalls', function () {

			beforeEach(function () {
				sinon.stub(request, 'get', Promise.method(function () {
					return {
						body: getFDAAPIFoodRecallResponse()
					};
				}));
			});

			afterEach(function () {
				request.get.restore();
			});

			it('should format inputs and return a valid formatted recall response when inputs are provided', function (done) {
				var obj = {
						state: 'va',
						status: 'ongoing',
						eventid: 12345,
						firmname: 'test',
						from: 12345,
						to: 12345,
						classificationlevels: [1, 2],
						keywords: _.keys(recallHelper.keywordMappings),
						skip: 1,
						limit: 1
					},
					search = 'distribution_pattern:(VA+Virginia+nationwide+"national+distribution"+"nation+wide"+nationally+us+usa)+AND+status:ongoing+AND+event_id:12345+AND+recalling_firm:test+AND+recall_initiation_date:[1970-01-01+TO+1970-01-01]+AND+classification:("Class+I"+"Class+II")+AND+(dairy+dairies+butter+butters+cheddar+cheddars+cheese+cheeses+chocolate+chocolates+cream+creams+milk+milks+whey+wheies+dye+dyes+color+colors+red+reds+yellow+yellows+pink+pinks+blue+blues+green+greens+egg+eggs+fish+fishs+shellfish+shellfishs+oyster+oysters+tuna+tunas+salmon+salmons+shrimp+shrimps+herring+herrings+clam+clams+lobster+lobsters+seafood+seafoods+fruit+fruits+corn+corns+raspberry+raspberries+pineapple+pineapples+pear+pears+peach+peachs+apple+apples+plum+plums+lemon+lemons+strawberry+strawberries+mango+mangoes+cranberry+cranberries+orange+oranges+cherry+cherries+salsa+salsas+melon+melons+tomato+tomatoes+raisin+raisins+olive+olives+grape+grapes+pumpkin+pumpkins+pomegranate+pomegranates+gluten+glutens+wheat+wheats+bread+breads+pasta+pastas+flour+flours+rice+rices+bagel+bagels+cake+cakes+cookie+cookies+brownie+brownies+taco+tacoes+pizza+pizzas+meat+meats+chicken+chickens+steak+steaks+beef+beefs+sausage+sausages+pork+porks+ham+hams+turkey+turkeies+bacon+bacons+nut+nuts+peanut+peanuts+seed+seeds+walnut+walnuts+almond+almonds+pistachio+pistachioes+hazelnut+hazelnuts+pecan+pecans+soy+soies+tofu+tofus+spice+spices+vanilla+vanillas+peppermint+peppermints+garlic+garlics+ginseng+ginsengs+ginger+gingers+herb+herbs+seasoning+seasonings+cumin+cumins+cinnamon+cinnamons+salt+salts+coriander+corianders+honey+honeies+supplement+supplements+coffee+coffees+vegetable+vegetables+salad+salads+spinach+spinachs+lettuce+lettuces+sprout+sprouts+mushroom+mushrooms+onion+onions+potato+potatoes+romaine+romaines+broccoli+broccolies+celery+celeries+cucumber+cucumbers+pea+peas+cabbage+cabbages+chili+chilies+jalapeno+jalapenoes+pepper+peppers+bean+beans)';

				fdaAdpt.searchFoodRecalls(obj).then(function (foodrecalls) {
					// check the format of the inputs
					var opts = request.get.args[0][0];
					assert.isObject(opts.qs, 'searchFoodRecalls did not submit an object for qs');
					assert.propertyVal(opts.qs, 'search', search, 'searchFoodRecalls did not submit the correct search');
					assert.propertyVal(opts.qs, 'skip', obj.skip, 'searchFoodRecalls did not submit the correct skip');
					assert.propertyVal(opts.qs, 'limit', obj.limit, 'searchFoodRecalls did not submit the correct limit');

					// check the format of the outputs
					assert.deepEqual(foodrecalls, getFDAAPIFoodRecallFormattedResponse(), 'searchFoodRecalls did not return a valid response');

					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return a valid formatted recall response when no inputs are provided', function (done) {
				var obj = {},
					search = '';

				fdaAdpt.searchFoodRecalls(obj).then(function (foodrecalls) {
					// check the format of the inputs
					var opts = request.get.args[0][0];
					assert.isObject(opts.qs, 'searchFoodRecalls did not submit an object for qs');
					assert.propertyVal(opts.qs, 'search', search, 'searchFoodRecalls did not submit the correct search');
					assert.propertyVal(opts.qs, 'skip', null, 'searchFoodRecalls did not submit the correct skip');
					assert.propertyVal(opts.qs, 'limit', 100, 'searchFoodRecalls did not submit the correct limit');

					// check the format of the outputs
					assert.deepEqual(foodrecalls, getFDAAPIFoodRecallFormattedResponse(), 'searchFoodRecalls did not return a valid response');

					done();
				}).catch(function (err) {
					done(err);
				});
			});

		});

		describe('getFoodRecallById', function () {

			beforeEach(function () {
				sinon.stub(request, 'get', Promise.method(function () {
					return {
						body: getFDAAPIFoodRecallResponse()
					};
				}));
			});

			afterEach(function () {
				request.get.restore();
			});

			it('should return a valid formatted recall object', function (done) {
				var obj = {
						id: getFDAAPIFoodRecallFormattedObject().id
					},
					search = 'event_id:65392+AND+recall_initiation_date:"20130604"+AND+product_description:(070207000110+AND+nutritional+AND+package+AND+plastic+AND+almond+AND+sliced)';

				fdaAdpt.getFoodRecallById(obj).then(function (foodrecall) {
					// check the format of the inputs
					var opts = request.get.args[0][0];
					assert.isObject(opts.qs, 'getFoodRecallById did not submit an object for qs');
					assert.propertyVal(opts.qs, 'search', search, 'getFoodRecallById did not submit the correct search');

					// check the format of the outputs
					assert.deepEqual(foodrecall, getFDAAPIFoodRecallFormattedObject(), 'getFoodRecallById did not return a valid response');

					done();
				}).catch(function (err) {
					done(err);
				});
			});

			it('should return a 409 invalid id when the id is not a base64 encoded string', function (done) {
				var obj = {
					id: 'bad'
				};

				fdaAdpt.getFoodRecallById(obj).then(function () {
					done(new Error('getFoodRecallById expected to get an error'));
				}).catch(function (err) {
					assert.instanceOf(err, Error, 'getFoodRecallById did not return an error');
					assert.propertyVal(err, 'type', 'INVALID_ARGUMENT', 'getFoodRecallById did not return an error with a valid type property');
					assert.propertyVal(err, 'message', 'Invalid id', 'getFoodRecallById did not return an error with a valid message property');

					done();
				});
			});

		});

	});

};
