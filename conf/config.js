'use strict';

var _ = require('underscore');

/**
 *
 * @type {{environment: (*|string), mongodb: *, secret: (*|string), sessionlength: (*|number), port: (*|number)}}
 */
exports = _.extend({
	NODE_ENV: 'production',
	SECRET: 'foobarbaz',
	SESSIONLENGTH: 3600000,
	PORT: 5000
}, process.env);
