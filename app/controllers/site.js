'use strict';

var _ = require('underscore'),
	path = require('path'),
	fdaAdapter = require(path.join(global.__adptsdir, 'fdaapi'));

exports.landing = function (req, res) {
	if (!req.session.preferences.haslanded) {
		req.session.preferences.haslanded = true;
	}

	if (req.session.preferences.state) {
		return res.redirect('/browse');
	} else {
		return res.render('landing', {
			uspsuser: global.config.USPS_USER || ''
		});
	}
};

exports.browse = function (req, res) {
	if (!req.session.preferences.state && !req.session.preferences.haslanded) {
		return res.redirect('/');
	} else {
		return res.render('browse', {
			state: req.session.preferences.state,
			fbappid: global.config.FACEBOOK_APPID
		});
	}
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
