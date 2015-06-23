'use strict';

var _ = require('underscore'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

exports.landing = function (req, res, next) {
	return res.render('landing', {
		state: req.session.preferences.state
	});
};

exports.browse = function (req, res, next) {
	return res.render('browse');
};

exports.details = function (req, res, next) {
	fdaAdapter.getFoodRecallById({id: req.params.id}).then(function (recall) {
		return res.render('recall', {
			recall: recall
		});
	}).catch(function (err) {
		//res.status(500).send('Could not retrieve recall information.');
		return res.render('recall', {
			recall: {
				recall_number: 'F-1355-2015',
				reason_for_recall: 'Product may contain undeclared allergen (Hazelnuts)',
				status: 'Completed',
				distribution_pattern: 'MA, ME , NH, NJ, NY',
				product_quantity: '19 units',
				recall_initiation_date: 1422334800,
				state: 'NH',
				event_id: '70421',
				product_type: 'Food',
				product_description: 'Lindt Chocolate Specialties Milk Chocolate Covered Almonds,6.4 oz.  packaged in a stand up bag (resealable pouch)\nItem Number: #8698 (or #8379)',
				country: 'US',
				city: 'Stratham',
				recalling_firm: 'Lindt & Sprungli USA',
				report_date: 1425445200,
				voluntary_mandated: 'Voluntary: Firm Initiated',
				classification: 'Class I',
				code_info: 'Lot Code: L2975',
				initial_firm_notification: 'Two or more of the following: Email, Fax, Letter, Press Release, Telephone, Visit',
				classificationlevel: 1,
				mandated: false,
				affectedstates: ['MA','ME','NH','NJ','NY'],
				affectednationally: false
			}
		});
	}).done();
};

exports.map = function (req, res, next) {
	return res.render('map', {
		uspsuser: global.config.USPS_USER || ''
	});
};

exports.geocode = function (req, res, next) {
	return res.render('geocode', {
		uspsuser: global.config.USPS_USER || ''
	});
};

exports.preferencesGet = function (req, res, next) {
	res.json(req.session.preferences);
};

exports.preferencesSet = function (req, res, next) {
	_.each(req.body, function (val, key) {
		req.session.preferences[key] = val;
	});
	try {
		req.session.save();
		res.status(200).end();
	} catch (e) {
		res.status(500).send(e.message);
	}
};
