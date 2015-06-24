'use strict';

var _ = require('underscore'),
	path = require('path'),
	url = require('url'),
	recallsDal = require(path.join(global.__dalsdir, 'recalls'));

var defaultPorts = {
	'http': 80,
	'https': 443
};

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
	recallsDal.getById({id: req.params.id}).then(function (recall) {
		var serverURL = req.protocol + '://' + req.get('host'),
			urlObj = url.parse(serverURL);

		return res.render('recall', {
			recall: recall,
			fbappid: global.config.FACEBOOK_APPID,
			url: serverURL + (!urlObj.port && global.config.PORT !== defaultPorts[req.protocol] ? ':' + global.config.PORT : '')
		});
	}).catch(function (err) {
		console.error(err);

		switch (err.type) {
			case 'notfound':
				return res.render('404');
			case 'validation':
				return res.render('recall', {
					recall: null,
					error: {
						statusCode: 409,
						message: err.message
					}
				});
			default:
				return res.render('error', {
					code: 500,
					title: 'Internal Error',
					message: err.message
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
	return res.json(req.session.preferences);
};

exports.preferencesSet = function (req, res) {
	_.each(req.body, function (val, key) {
		req.session.preferences[key] = val;
	});

	try {
		req.session.save();

		return res.json({
			code: "OK",
			message: "Success!"
		});
	} catch (e) {
		return res.status(500).json(e.message);
	}
};

exports.popupClose = function (req, res) {
	return res.render('popupclose');
};
