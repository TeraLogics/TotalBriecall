/*
 * Copyright (C) 2014 TeraLogics, LLC. All Rights Reserved.
 */

'use strict';

var _ = require('underscore'),
	fs = require('fs'),
	moment = require('moment'),
	Promise = require('bluebird');

var DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";

function _outputFileWithHeaders(res, status, headerinfo, path) {
	var stream = fs.createReadStream(path, {
		bufferSize: 1024 * 1024
	});
	return exports.outputStream(res, status, headerinfo, stream);
}

exports.getHeaders = function (headers) {
	return _.pick(headers, 'expires', 'cache-control', 'pragma', 'content-description', 'content-transfer-encoding', 'content-type', 'content-length', 'content-disposition');
};

exports.outputHeaders = function (res, status, headerinfo) {
	if (!headerinfo || !_.isObject(headerinfo)) {
		headerinfo = {};
	}
	res.setHeader('expires', 0);
	res.setHeader('cache-control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
	res.setHeader('pragma', 'no-cache');
	res.setHeader('content-description', 'File Transfer');
	res.setHeader('content-transfer-encoding', 'chunked');
	res.setHeader('content-type', headerinfo.contenttype || 'application/octet-stream');
	res.setHeader('content-length', headerinfo.contentlength || 0);
	res.setHeader('content-disposition', (headerinfo.attachment ? 'attachment' : 'inline') + '; filename="' + (headerinfo.filename || 'unknown') + '"; modification-date="' + (headerinfo.modificationdate ? (moment.isMoment(headerinfo.modificationdate) ? headerinfo.modificationdate.format(DATE_RFC2822) : moment(headerinfo.modificationdate).format(DATE_RFC2822)) : moment().format(DATE_RFC2822)) + '";');
	res.writeHead(status);
};

exports.outputStream = function (res, status, headerinfo, stream) {
	return new Promise(function (resolve, reject) {

		exports.outputHeaders(res, status, headerinfo);

		stream.on('end', resolve);
		stream.on('error', function (err) {
			console.error(err);
			reject(err);
		});
		stream.pipe(res);
	});
};

exports.outputFile = function (res, status, headerinfo, path) {
	return new Promise(function (resolve, reject) {

		if (!headerinfo.contentlength || !headerinfo.modificationdate) {
			fs.stat(path, function (err, stats) {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					headerinfo.contentlength = stats.size;
					headerinfo.modificationdate = stats.mtime.getTime();
					_outputFileWithHeaders(res, status, headerinfo, path);
					resolve();
				}
			});
		} else {
			_outputFileWithHeaders(res, status, headerinfo, path);
			resolve();
		}
	});
};
