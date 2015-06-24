'use strict';

var path = require('path'),
	siteCtrl = require(path.join(global.__ctrldir, 'site'));

module.exports = function (app) {
	app.route('/')
		.get(siteCtrl.landing);

	app.route('/browse')
		.get(siteCtrl.browse);

	app.route('/details/:id')
		.get(siteCtrl.details);

	app.route('/map')
		.get(siteCtrl.map);

	app.route('/preferences')
		.get(siteCtrl.preferencesGet)
		.post(siteCtrl.preferencesSet);
};
