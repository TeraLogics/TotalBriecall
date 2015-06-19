'use strict';

var path = require('path'),
	siteCtrl = require(path.join(global.__ctrldir, 'site'));

module.exports = function (app, passport, middleware) {
	app.route('/')
		.get(siteCtrl.index);

	app.route('/details')
		.get(siteCtrl.details);

	app.route('/map')
		.get(siteCtrl.map);

	app.route('/geocode')
		.get(siteCtrl.geocode);
};
