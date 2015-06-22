'use strict';

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
