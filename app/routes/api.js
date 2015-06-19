'use strict';

var path = require('path'),
	apiCtrl = require(path.join(global.__ctrldir, 'api'));

module.exports = function (app) {
	app.route('/api/recalls/:id')
		.get(apiCtrl.getRecallById);

	app.route('/api/events/:id')
		.get(apiCtrl.getRecallByEventId);

	app.route('/api/firms/:name')
		.get(apiCtrl.getRecallByRecallingFirm);
};
