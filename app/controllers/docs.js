'use strict';

var mime = require('mime'),
	path = require('path'),
	outputHelper = require(path.join(global.__libdir, 'outputHelper'));

exports.api = function (req, res, next) {
	if (req.originalUrl === '/docs/api/') {
		// allow express to find the index based on configuration
		return res.render('docs/api/index.html');
	} else {
		var filePath = path.join(global.__viewsdir, req.originalUrl);

		outputHelper
			.outputFile(res, 200, {
				contenttype: mime.lookup(filePath),
				filename: path.basename(filePath)
			}, filePath).catch(function (err) {
				return res.render('500', {
					code: 500,
					title: 'Error rendering documentation'
				});
			}).done();
	}
};

exports.apiRedirect = function (req, res, next) {
	// redirect /api to /api/
	return res.redirect(301, req.url + "/");
};

exports.index = function (req, res, next) {
	// TODO implement docs page
	return res.redirect(302, req.url + "/");
};