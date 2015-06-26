'use strict';

var path = require('path'),
	siteCtrl = require(path.join(global.__ctrldir, 'site'));

/**
 * A function to register all of the routes with ExpressJS
 * @param {Object} app An instance of ExpressJS server
 */
module.exports = function (app) {
	app.route('/')
		.get(siteCtrl.landing);

	app.route('/js/brie-core.js')
		.get(siteCtrl.brieCore);

	app.route('/browse')
		.get(siteCtrl.browse);

	app.route('/details/:id')
		.get(siteCtrl.details);

	app.route('/map')
		.get(siteCtrl.map);

	app.route('/preferences')
		.get(siteCtrl.preferencesGet)
		.post(siteCtrl.preferencesSet);

	app.route('/popupclose')
		.get(siteCtrl.popupClose);
};
