'use strict';

var _ = require('underscore');

module.exports = _.extend({
	NODE_ENV: 'production',
	SECRET: 'foobarbaz',
	SESSIONLENGTH: 3600000,
	PORT: 5000
}, process.env);
