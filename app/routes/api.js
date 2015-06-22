'use strict';

var path = require('path'),
	apiCtrl = require(path.join(global.__ctrldir, 'api'));

/**
 * @apiDefine CommonParams
 * @apiVersion 1.0.0
 *
 * @apiParam {Number{0..5000}} [skip=0] The offset of the initial result to return.
 * @apiParam {Number{1..100}} [limit=100] The maximum number of results to return.
 */

/**
 * @apiDefine SuccessHeader Success
 */

/**
 * @apiDefine FailureHeader Failure
 */

/**
 * @apiDefine SuccessResponse
 * @apiVersion 1.0.0
 *
 * @apiSuccess (SuccessHeader) {Number} skip The skip input used to fetch data.
 * @apiSuccess (SuccessHeader) {Number} limit The limit input used to fetch data.
 * @apiSuccess (SuccessHeader) {Number} total The total rows found.
 * @apiSuccess (SuccessHeader) {Object[]} data An array of response data objects.
 * @apiSuccess (SuccessHeader) {String} data.recall_number The recall number.
 * @apiSuccess (SuccessHeader) {String} data.reason_for_recall The reason for recall.
 * @apiSuccess (SuccessHeader) {String} data.status The status of the recall.
 * @apiSuccess (SuccessHeader) {String} data.distribution_pattern The pattern for distribution of the recall.
 * @apiSuccess (SuccessHeader) {String} data.product_quantity The quantity distributed of the recall.
 * @apiSuccess (SuccessHeader) {String} data.recall_initiation_date The initial recall date.
 * @apiSuccess (SuccessHeader) {String} data.state The state for the contact of the distribution firm.
 * @apiSuccess (SuccessHeader) {String} data.event_id The event ID of the recall.
 * @apiSuccess (SuccessHeader) {String} data.product_type The product type of the recall.
 *
 * The value of this feed is always `"Food"`.
 * @apiSuccess (SuccessHeader) {String} data.product_description The description of the recalled product.
 * @apiSuccess (SuccessHeader) {String} data.country The country for the contact of the distribution firm.
 * @apiSuccess (SuccessHeader) {String} data.city The city for the contact of the distribution firm.
 * @apiSuccess (SuccessHeader) {String} data.recalling_firm The recalling firm's name.
 * @apiSuccess (SuccessHeader) {String} data.report_date The date for the recall report.
 * @apiSuccess (SuccessHeader) {String} data.voluntary_mandated The initiating party for the recall.
 * @apiSuccess (SuccessHeader) {String} data.classification The classification of the recall.
 * @apiSuccess (SuccessHeader) {String} data.code_info The descriptive markings of the recall.
 * @apiSuccess (SuccessHeader) {String} data.initial_firm_notification The initial method of notification from the recalling firm for the recall.
 */

/**
 * @apiDefine SuccessExample
 *
 * @apiSuccessExample {json} Success Example
 * HTTP/1.1 200 OK
 * {
 *   "skip": 0,
 *   "limit": 100,
 *   "total": 1,
 *   "data": [{
 *     "recall_number": "F-2331-2014",
 *     "reason_for_recall": "Undeclared color Red #3.",
 *     "status": "Ongoing",
 *     "distribution_pattern": "CA, KY, LA, MN, MS, NC, NJ, NY, OH, OK, PA, TX, VA",
 *     "product_quantity": "144 bags",
 *     "recall_initiation_date": "20140613",
 *     "state": "VA",
 *     "event_id": "68755",
 *     "product_type": "Food",
 *     "product_description": "Kettle Corn",
 *     "country": "US",
 *     "city": "Virginia Beach",
 *     "recalling_firm": "Anonymous Group.",
 *     "report_date": "20140827",
 *     "voluntary_mandated": "Voluntary: Firm Initiated",
 *     "classification": "Class III",
 *     "code_info": "3/15/14, 6/12/14",
 *     "initial_firm_notification": "Letter"
 *   }]
 * }
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

module.exports = function (app) {
	/**
	 * @api {get} /recalls/:recallid Get Recall By ID
	 * @apiName GetRecallByID
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recall identified by `recallid`.
	 *
	 * @apiParam {String} recallid The recall ID.
	 *
	 * @apiUse SuccessResponse
	 *
	 * @apiUse SuccessExample
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There is no recall identified by `recallid`.
	 * @apiError (FailureHeader) InvalidArgumentError `skip` or `limit` cannot be provided.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/recalls/:id')
		.get(apiCtrl.getRecallById);

	/**
	 * @api {get} /events/:eventid Get Recalls By Event ID
	 * @apiName GetRecallsByEventID
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recalls associated with `eventid`.
	 *
	 * @apiParam {Number} eventid The event ID.
	 * @apiUse CommonParams
	 *
	 * @apiUse SuccessResponse
	 *
	 * @apiUse SuccessExample
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There are no recalls associated with `eventid`.
	 * @apiError (FailureHeader) InvalidArgumentError `eventid` is invalid. It must be a valid number.
	 *
	 * `skip` or `limit` are invalid. They must be in their respective ranges.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/events/:id')
		.get(apiCtrl.getRecallByEventId);

	/**
	 * @api {get} /firms/:firmname Get Recalls By Recalling Firm Name
	 * @apiName GetRecallsByRecallingFirmName
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recall identified by `firmname`.
	 *
	 * @apiParam {String} firmname The recalling firm's name.
	 * @apiUse CommonParams
	 *
	 * @apiUse SuccessResponse
	 *
	 * @apiUse SuccessExample
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There are no recalls associated with `firmname`.
	 * @apiError (FailureHeader) InvalidArgumentError `skip` or `limit` are invalid. They must be in their respective ranges.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/firms/:name')
		.get(apiCtrl.getRecallByRecallingFirm);

	/**
	 * @api {get} /search Search Recalls
	 * @apiName SearchRecalls
	 * @apiVersion 1.0.0
	 *
	 * @apiDescription Gets the recalls matching provided parameters.
	 *
	 * @apiParam {String} [state] The state abbreviation affected by the recall.
	 * @apiParam {Number} [from] The timestamp for the earliest point in the desired time period. Requires `to` parameter.
	 * @apiParam {Number} [to] The timestamp for the latest point in the desired time period. Requires `from` parameter.
	 * @apiParam {Number={1..3} [classificationlevel] The classification level of the recall.
	 * @apiParam {String[]="dairy","dye","egg","fish","gluten","nut","soy"} [keywords] An array of keywords to target in reason for recall.
	 * @apiUse CommonParams
	 *
	 * @apiUse SuccessResponse
	 *
	 * @apiUse SuccessExample
	 *
	 * @apiError (FailureHeader) ResourceNotFoundError There are no recalls associated with provided parameters.
	 * @apiError (FailureHeader) InvalidArgumentError `state` is invalid. It must be a valid state abbreviation, including 'DC'.
	 *
	 * `from` is invalid. It must be a valid timestamp and must have an associated `to` parameter. `from` must be before `to`.
	 *
	 * `to` is invalid. It must be a valid timestamp and must have an associated `from` parameter. `to` must be after `from`.
	 *
	 * `classificationlevel` is invalid. It must be one of the valid values.
	 *
	 * `keywords` is invalid. It must be one of the valid values.
	 *
	 * `skip` or `limit` are invalid. They must be in their respective ranges.
	 *
	 * @apiUse ResourceNotFoundErrorExample
	 * @apiUse InvalidArgumentErrorExample
	 */
	app.route('/api/search')
		.get(apiCtrl.search);
};
