'use strict';

exports.index = function (req, res, next) {
	return res.render('index');
};

exports.details = function (req, res, next) {
	return res.render('details');
};
