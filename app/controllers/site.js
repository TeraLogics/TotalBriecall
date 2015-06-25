'use strict';

var _ = require('underscore'),
	path = require('path'),
	url = require('url'),
	recallHelper = require(path.join(global.__libdir, 'recallHelper')),
	recallsDal = require(path.join(global.__dalsdir, 'recalls'));

var defaultPorts = {
	'http': 80,
	'https': 443
};

/**
 * Renders the landing page.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.landing = function (req, res) {
	if (!req.session.preferences.haslanded) {
		req.session.preferences.haslanded = true;
	}

	if (req.session.preferences.state) {
		res.redirect('/browse');
	} else {
		res.render('landing');
	}
};

/**
 * Renders the browse page.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.browse = function (req, res) {
	if (!req.session.preferences.state && !req.session.preferences.haslanded) {
		res.redirect('/');
	} else {
		res.locals.categories = _.keys(recallHelper.keywordMappings).sort();
		res.render('browse');
	}
};

/**
 * Renders the details page.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.details = function (req, res) {
	recallsDal.getById({ id: req.params.id }).then(function (recall) {
		var serverURL = req.protocol + '://' + req.get('host'),
			urlObj = url.parse(serverURL);

		return res.render('recall', {
			recall: recall,
			url: serverURL + (!urlObj.port && global.config.PORT !== defaultPorts[req.protocol] ? ':' + global.config.PORT : '')
		});
	}).catch(function (err) {
		console.error(err);

		switch (err.type) {
			case 'NOT_FOUND':
				return res.render('404');
			case 'INVALID_ARGUMENT':
				return res.render('404', {
					message: err.message
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

/**
 * Renders the map page.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.map = function (req, res) {
	res.render('map', {
		uspsuser: global.config.USPS_USER || ''
	});
};

/**
 * Gets preferences for a user.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.preferencesGet = function (req, res) {
	res.json(req.session.preferences);
};

/**
 * Sets preferences for the user
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.preferencesSet = function (req, res) {
	_.each(req.body, function (val, key) {
		req.session.preferences[key] = val;
	});

	try {
		req.session.save();

		res.json({
			code: "OK",
			message: "Success!"
		});
	} catch (e) {
		res.status(500).json(e.message);
	}
};

/**
 * Renders the popup close page which is used to close the window broken Facebook links.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
exports.popupClose = function (req, res) {
	res.render('popupclose');
};
