'use strict';

var _ = require('underscore'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

exports.landing = function (req, res, next) {
	return res.render('landing', {
		state: req.session.state
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
		res.status(500).send('Could not retrieve recall information.');
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
	res.json(req.session.preferences || {});
};

exports.preferencesSet = function (req, res, next) {
	if (!req.session.hasOwnProperty('preferences')) {
		req.session.preferences = {};
	}
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
