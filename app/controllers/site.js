'use strict';

var _ = require('underscore'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

exports.landing = function (req, res) {
	return res.render('landing', {
		state: req.session.preferences.state
	});
};

exports.browse = function (req, res) {
	return res.render('browse');
};

exports.details = function (req, res) {
	fdaAdapter.getFoodRecallById({ id: req.params.id }).then(function (recall) {
		return res.render('recall', {
			recall: recall
		});
	}).catch(function (err) {
		if (err instanceof Error) {
			// errors raised by the adapter
			return res.render('recall', {
				recall: null,
				error: {
					statusCode: 500,
					message: err.message
				}
			});
		} else if (err && err.statusCode && err.error) {
			// errors probably in a ServerResponse from the FDA API
			return res.render('recall', {
				recall: null,
				error: {
					statusCode: err.statusCode,
					message: err.error.message
				}
			});
		} else {
			// anything else
			if (err) {
				console.error(err);
			}
			return res.render('recall', {
				recall: null,
				error: {
					statusCode: 500,
					message: 'An unknown error occurred.'
				}
			});
		}
	}).done();
};

exports.map = function (req, res) {
	return res.render('map', {
		uspsuser: global.config.USPS_USER || ''
	});
};

exports.geocode = function (req, res) {
	return res.render('geocode', {
		uspsuser: global.config.USPS_USER || ''
	});
};

exports.preferencesGet = function (req, res) {
	res.json(req.session.preferences);
};

exports.preferencesSet = function (req, res) {
	_.each(req.body, function (val, key) {
		req.session.preferences[key] = val;
	});
	try {
		req.session.save();
		res.json({ code: "OK", message: "Success!" });
	} catch (e) {
		res.status(500).send(e.message);
	}
};
