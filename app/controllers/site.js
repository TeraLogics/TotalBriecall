'use strict';

var _ = require('underscore');

exports.landing = function (req, res, next) {
	return res.render('landing', {
		state: req.session.state
	});
};

exports.browse = function (req, res, next) {
	return res.render('browse');
};

exports.details = function (req, res, next) {
	return res.render('details', {
		id: req.params.id
	});
};

exports.map = function (req, res, next) {
	return res.render('map');
};

exports.geocode = function (req, res, next) {
	return res.render('geocode');
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
