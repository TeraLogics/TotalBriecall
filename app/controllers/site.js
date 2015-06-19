'use strict';

exports.index = function (req, res, next) {
	return res.send('Hello World! The cheesiest changes are afoot!');
	//return res.render('index');
};

exports.details = function (req, res, next) {
	return res.render('details');
};
