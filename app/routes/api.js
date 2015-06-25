'use strict';

var path = require('path'),
	apiCtrl = require(path.join(global.__ctrldir, 'api'));

/**
 * @apiDefine SuccessHeader Success
 */

/**
 * @apiDefine FailureHeader Failure
 */

/**
 * @apiDefine ResourceNotFoundErrorExample
 * @apiErrorExample {json} ResourceNotFoundError
 * HTTP/1.1 404 Not Found
 * {
 *   "error": {
 *     "code": "NOT_FOUND",
 *     "message": "..."
 *   }
 * }
 */

/**
 * @apiDefine InvalidArgumentErrorExample
 * @apiErrorExample {json} InvalidArgumentError
 * HTTP/1.1 409 Conflict
 * {
 *   "error": {
 *     "code": "INVALID_ARGUMENT",
 *     "message": "..."
 *   }
 * }
 */

/**
 * A function to register all of the routes with ExpressJS
 * @param {Object} app An instance of ExpressJS server
 */
module.exports = function (app) {
	/**
	 * @api {put} /comments Add comment
	 * @apiGroup Comments
	 * @apiName AddComment
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Adds a comment to the recall identified by `recallnumber`.
	 *
	 * @apiParam {String} recallnumber The recall number.
	 * @apiParam {String} name The name of the commenter.
	 * @apiParam {String} [location] The location of the user.
	 *
	 * If `location` is not provided, the user's current session's state preference is used.
	 * @apiParam {String} comment The comment.
	 *
	 * @apiSuccess (SuccessHeader) {Number} created The date/time when the comment was created as UNIX timestamp.
	 * @apiSuccess (SuccessHeader) {String} name The name of the commenter.
	 * @apiSuccess (SuccessHeader) {String} location The location of the user.
	 * @apiSuccess (SuccessHeader) {String} comment The comment.
	 *
	 * @apiSuccessExample {json} Success Example
	 * HTTP/1.1 200 OK
	 * {
	 *   "created": 123456789,
	 *   "name": "Vizzini",
	 *   "location": "IL",
	 *   "comment": "Inconceivable."
	 * }
	 *
	 * @apiError (FailureHeader) InvalidArgumentError `recallnumber`, `location` or `comment` was not provided or was invalid. They must be strings.
	 *
	 * `location` is invalid. It must be a string and a valid US state abbreviation.
	 *
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/comments')
		.put(apiCtrl.addCommentForRecall);

	/**
	 * @api {get} /recalls/categories Get Recall Categories
	 * @apiGroup Recalls
	 * @apiName GetRecallCategories
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recall categories.
	 *
	 * @apiSuccess (SuccessHeader) {String[]} -- The recall categories.
	 *
	 * @apiSuccessExample {json} Success Example
	 * HTTP/1.1 200 OK
	 * [
	 *   "fruit",
	 *   "fish"
	 * ]
	 */
	app.route('/api/recalls/categories')
		.get(apiCtrl.getRecallCategories);

	/**
	 * @api {get} /recalls/:recallid Get Recall
	 * @apiGroup Recalls
	 * @apiName GetRecall
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recall identified by `recallid`.
	 *
	 * @apiParam {String} recallid The recall ID.
	 *
	 * @apiSuccess (SuccessHeader) {String} recall_number The recall number.
	 * @apiSuccess (SuccessHeader) {String} reason_for_recall The reason for the recall.
	 * @apiSuccess (SuccessHeader) {String} status The status.
	 * @apiSuccess (SuccessHeader) {String} distribution_pattern The distribution pattern of the recalled product.
	 * @apiSuccess (SuccessHeader) {String} product_quantity The number of products recalled.
	 * @apiSuccess (SuccessHeader) {Number} recall_initiation_date The date/time when the recall was initiated as a UNIX timestamp.
	 * @apiSuccess (SuccessHeader) {String} state The state for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {Number} event_id The ID of the recall event that includes this recall.
	 * @apiSuccess (SuccessHeader) {String} product_type The type of product recalled.
	 *
	 * The value of this field is always `"Food"`.
	 * @apiSuccess (SuccessHeader) {String} product_description The description of the recalled product.
	 * @apiSuccess (SuccessHeader) {String} country The country for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {String} city The city for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {String} recalling_firm The recalling firm.
	 * @apiSuccess (SuccessHeader) {Number} report_date The date/time when the recall was reported.
	 * @apiSuccess (SuccessHeader) {String} voluntary_mandated Explanation of whether the recall was voluntary or mandatory.
	 * @apiSuccess (SuccessHeader) {Boolean} mandated Indicates whether the recall was mandatory.
	 * @apiSuccess (SuccessHeader) {String} classification The classification of the recall.
	 * @apiSuccess (SuccessHeader) {String} code_info The descriptive markings of the recall.
	 * @apiSuccess (SuccessHeader) {String} initial_firm_notification The initial method of notification from the recalling firm for the recall.
	 * @apiSuccess (SuccessHeader) {String} id A unique ID that identifies the recall.
	 * @apiSuccess (SuccessHeader) {Number} classificationlevel The `classification` expressed as a numerical level.
	 * @apiSuccess (SuccessHeader) {String[]} affectedstates The `distribution_pattern` expressed as an array of state abbreviations.
	 * @apiSuccess (SuccessHeader) {Boolean} affectednationally Indicates whether `distribution_pattern` indicates national distribution.
	 * @apiSuccess (SuccessHeader) {String[]} categories An array of categories into which this recall may fall.
	 * @apiSuccess (SuccessHeader) {String} openfda_id The `@id` from the OpenFDA API.
	 * @apiSuccess (SuccessHeader) {Object[]} comments An array of comments that have been made on this recall.
	 * @apiSuccess (SuccessHeader) {Number} comments.created The date/time when the comment was created as UNIX timestamp.
	 * @apiSuccess (SuccessHeader) {String} comments.name The name of the commenter.
	 * @apiSuccess (SuccessHeader) {String} comments.location The location of the user.
	 * @apiSuccess (SuccessHeader) {String} comments.comment The comment.
	 *
	 * @apiSuccessExample {json} Success Example
	 * HTTP/1.1 200 OK
	 * {
	 *   "recall_number": "F-123-4567",
	 *   "reason_for_recall": "There were peanuts in the apples.",
	 *   "status": "Ongoing",
	 *   "distribution_pattern": "AK only.",
	 *   "product_quantity": "2",
	 *   "recall_initiation_date": 1347235200,
	 *   "state": "AK",
	 *   "event_id": 46798,
	 *   "product_type": "Food",
	 *   "product_description": "Very shiny apples.",
	 *   "country": "US",
	 *   "city": "Anchorage",
	 *   "recalling_firm": "Far-North Apple Distributor",
	 *   "report_date": 1351036800,
	 *   "voluntary_mandated": "Voluntary: Firm Initiated",
	 *   "classification": "Class III",
	 *   "code_info": "All apples with peanuts sticking out of them.",
	 *   "initial_firm_notification": "E-Mail",
	 *   "id": "Ri0wMjgzLTIwMTMLNjMxNTkLMjAxMjA5MTALenVjY2hpbmkrcG91bmRz",
	 *   "classificationlevel": 3,
	 *   "mandated": false,
	 *   "affectedstates": [
	 *     "AK"
	 *   ],
	 *   "affectednationally": false,
	 *   "categories": [
	 *     "fruit"
	 *   ],
	 *   "openfda_id": "00028a950de0ef32fc01dc3963e6fdae7073912c0083faf0a1d1bcdf7a03c44c",
	 *   "comments": [{
	 *     "created": 1435191493,
	 *     "name": "Granny Smith",
	 *     "location": "AK",
	 *     "comment": "I was wondering why my apples were super crunchy!"
	 *   }]
	 * }
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There is no recall identified by `recallid`.
	 * @apiError (FailureHeader) InvalidArgumentError `id` is invalid.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/recalls/:id')
		.get(apiCtrl.getRecallById);

	/**
	 * @api {get} /recalls Get Recalls
	 * @apiGroup Recalls
	 * @apiName GetRecalls
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets recalls matching the provided parameters.
	 *
	 * @apiParam {String} [state] The two-letter abbreviation of the state affected by the recall.
	 * @apiParam {Number} [eventid] The event ID.
	 * @apiParam {String} [firmname] The recalling firm's name.
	 * @apiParam {Number} [from] A date/time that the `recall_initiation_date` must be after, as a UNIX timestamp.
	 *
	 * When `from` is provided, `to` must be provided.
	 * @apiParam {Number} [to] A date/time that the `recall_initiation_date` must be before, as a UNIX timestamp.
	 *
	 * When `to` is provided, `from` must be provided.
	 * @apiParam {String} [classificationlevels] A comma-delimited list of one or more classification levels.
	 *
	 * Allowed values: `1`, `2`, `3`.
	 * @apiParam {String} [keywords] A comma-delimited list of one or more keywords.
	 *
	 * Allowed values: `"dairy"`, `"dye"`, `"egg"`, `"fish"`, `"fruit"`, `"gluten"`, `"meat"`, `"nut"`, `"soy"`, `"spice"`, `"supplement"`, `"vegetable"`
	 * @apiParam {Number{0..5000}} [skip=0] How many records to skip in the results.
	 * @apiParam {Number{1..100}} [limit=100] The maximum number of results to return.
	 *
	 * @apiSuccess (SuccessHeader) {Number} skip The value of the `skip` input parameter.
	 * @apiSuccess (SuccessHeader) {Number} limit The value of the `limit` input parameter.
	 * @apiSuccess (SuccessHeader) {Number} total The total number of records matchin the parameters.
	 * @apiSuccess (SuccessHeader) {Object[]} data An array of response data objects.
	 * @apiSuccess (SuccessHeader) {String} data.recall_number The recall number.
	 * @apiSuccess (SuccessHeader) {String} data.reason_for_recall The reason for the recall.
	 * @apiSuccess (SuccessHeader) {String} data.status The status.
	 * @apiSuccess (SuccessHeader) {String} data.distribution_pattern The distribution pattern of the recalled product.
	 * @apiSuccess (SuccessHeader) {String} data.product_quantity The number of products recalled.
	 * @apiSuccess (SuccessHeader) {Number} data.recall_initiation_date The date/time when the recall was initiated as a UNIX timestamp.
	 * @apiSuccess (SuccessHeader) {String} data.state The state for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {Number} data.event_id The ID of the recall event that includes this recall.
	 * @apiSuccess (SuccessHeader) {String} data.product_type The type of product recalled.
	 *
	 * The value of this field is always `"Food"`.
	 * @apiSuccess (SuccessHeader) {String} data.product_description The description of the recalled product.
	 * @apiSuccess (SuccessHeader) {String} data.country The country for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {String} data.city The city for the contact of the distribution firm.
	 * @apiSuccess (SuccessHeader) {String} data.recalling_firm The recalling firm.
	 * @apiSuccess (SuccessHeader) {Number} data.report_date The date/time when the recall was reported.
	 * @apiSuccess (SuccessHeader) {String} data.voluntary_mandated Explanation of whether the recall was voluntary or mandatory.
	 * @apiSuccess (SuccessHeader) {Boolean} data.mandated Indicates whether the recall was mandatory.
	 * @apiSuccess (SuccessHeader) {String} data.classification The classification of the recall.
	 * @apiSuccess (SuccessHeader) {String} data.code_info The descriptive markings of the recall.
	 * @apiSuccess (SuccessHeader) {String} data.initial_firm_notification The initial method of notification from the recalling firm for the recall.
	 * @apiSuccess (SuccessHeader) {String} id A unique ID that identifies the recall.
	 * @apiSuccess (SuccessHeader) {Number} data.classificationlevel The `classification` expressed as a numerical level.
	 * @apiSuccess (SuccessHeader) {String[]} data.affectedstates The `distribution_pattern` expressed as an array of state abbreviations.
	 * @apiSuccess (SuccessHeader) {Boolean} data.affectednationally Indicates whether `distribution_pattern` indicates national distribution.
	 * @apiSuccess (SuccessHeader) {String[]} data.categories An array of categories into which this recall may fall.
	 * @apiSuccess (SuccessHeader) {String} data.openfda_id The `@id` from the OpenFDA API.
	 * @apiSuccess (SuccessHeader) {Object[]} data.comments An array of comments that have been made on this recall.
	 * @apiSuccess (SuccessHeader) {Number} data.comments.created The date/time when the comment was created as UNIX timestamp.
	 * @apiSuccess (SuccessHeader) {String} data.comments.name The name of the commenter.
	 * @apiSuccess (SuccessHeader) {String} data.comments.location The location of the user.
	 * @apiSuccess (SuccessHeader) {String} data.comments.comment The comment.
	 *
	 * @apiSuccessExample {json} Success Example
	 * HTTP/1.1 200 OK
	 * {
	 *   "skip": 0,
	 *   "limit": 100,
	 *   "total": 1,
	 *   "data": [{
	 *     "recall_number": "F-123-4567",
	 *     "reason_for_recall": "There were peanuts in the apples.",
	 *     "status": "Ongoing",
	 *     "distribution_pattern": "AK only.",
	 *     "product_quantity": "2",
	 *     "recall_initiation_date": 1347235200,
	 *     "state": "AK",
	 *     "event_id": 46798,
	 *     "product_type": "Food",
	 *     "product_description": "Very shiny apples.",
	 *     "country": "US",
	 *     "city": "Anchorage",
	 *     "recalling_firm": "Far-North Apple Distributor",
	 *     "report_date": 1351036800,
	 *     "voluntary_mandated": "Voluntary: Firm Initiated",
	 *     "classification": "Class III",
	 *     "code_info": "All apples with peanuts sticking out of them.",
	 *     "initial_firm_notification": "E-Mail",
	 *     "id": "Ri0wMjgzLTIwMTMLNjMxNTkLMjAxMjA5MTALenVjY2hpbmkrcG91bmRz",
	 *     "classificationlevel": 3,
	 *     "mandated": false,
	 *     "affectedstates": [
	 *       "AK"
	 *     ],
	 *     "affectednationally": false,
	 *     "categories": [
	 *       "fruit"
	 *     ],
	 *     "openfda_id": "00028a950de0ef32fc01dc3963e6fdae7073912c0083faf0a1d1bcdf7a03c44c",
	 *     "comments": [{
	 *       "created": 1435191493,
	 *       "name": "Granny Smith",
	 *       "location": "AK",
	 *       "comment": "I was wondering why my apples were super crunchy!"
	 *     }]
	 *   }]
	 * }
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There are no recalls matching the provided parameters.
	 * @apiError (FailureHeader) InvalidArgumentError `state` is invalid. It must be a valid US state abbreviation, including `"DC"`.
	 *
	 * `eventid` is invalid. It must be an integer.
	 *
	 * `from` is invalid. It must be a valid UNIX timestamp.
	 *
	 * `to` is invalid. It must be a valid UNIX timestamp.
	 *
	 * `from` and `to` are invalid. `from` must be before `to`, and if one is provided, both must be.
	 *
	 * `classificationlevels` is invalid. It/they must be one of the valid values.
	 *
	 * `keywords` is invalid. It/they must be one of the valid values.
	 *
	 * `skip` or `limit` are invalid. They must integers in their respective ranges.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/recalls')
		.get(apiCtrl.getRecalls);

	/**
	 * @api {get} /counts/recalls Count Distinct Recall Values
	 * @apiGroup Counts
	 * @apiName CountDistinctRecallValues
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets count information for distinct values in a recall field.
	 *
	 * @apiParam {String} field The field for which to get count information.
	 * @apiParam {String} [state] The affected state.
	 * @apiParam {String="Ongoing","Completed","Terminated","Pending"} [status] The recall status.
	 *
	 * @apiSuccess (SuccessHeader) {Number} total Total recall count.
	 * @apiSuccess (SuccessHeader) {Object} counts The counts of unique values.
	 * @apiSuccess (SuccessHeader) {Number} counts.term The count of a specific value.
	 *
	 * There will be a `term` key for every distinct value.
	 *
	 * @apiSuccessExample {json} Success Example
	 * HTTP/1.1 200 OK
	 * {
	 *   "total": 3416,
	 *   "counts": {
	 *     "Class I": 1518,
	 *     "Class II": 1816,
	 *     "Class III": 82
	 *   }
	 * }
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There are no recalls associated with provided parameters.
	 * @apiError (FailureHeader) InvalidArgumentError `field` is invalid. It must be a supported count field.
	 *
	 * `state` is invalid. It must be a valid US state abbreviation, including `"DC"`.
	 *
	 * `status` is invalid. It must be one of the valid values.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/counts/recalls')
		.get(apiCtrl.getRecallsCounts);
};
