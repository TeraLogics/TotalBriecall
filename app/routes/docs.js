'use strict';

var path = require('path'),
	docsCtrl = require(path.join(global.__ctrldir, 'docs'));

module.exports = function (app, passport, middleware) {
	app.route('/docs/api/*')
		.get(docsCtrl.api);

	app.route('/docs/api')
		.get(docsCtrl.apiRedirect);

/*
	app.route('/docs')
		.get(docsCtrl.index);
*/
};
