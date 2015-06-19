'use strict';

exports.index = function (req, res, next) {
	return res.send('Hello World! The cheesiest changes are afoot!');
/*
	return res.render('index', {
		state: req.session.state
	});
*/
};

exports.details = function (req, res, next) {
	return res.render('details', {
		id: req.params.id
	});
};
