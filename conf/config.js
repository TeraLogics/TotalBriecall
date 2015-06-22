'use strict';
/**
 *
 * @type {{environment: (*|string), mongodb: *, secret: (*|string), sessionlength: (*|number), port: (*|number)}}
 */
exports = {
	environment: process.env.NODE_ENV || 'production',
	mongodb: process.env.MONGOLAB_URI,
	secret: process.env.SECRET || 'foobarbaz',
	sessionlength: process.env.SESSIONLENGTH || 3600000,
	port: process.env.PORT || 5000
};
