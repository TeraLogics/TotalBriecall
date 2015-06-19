'use strict';

var _ = require('underscore'),
	fs = require('fs'),
	objectPath = require('object-path'),
	path = require('path'),
	Promise = require('bluebird'),
	crypto = require(path.join(global.__libdir, 'crypto'))(),
	readFile = Promise.promisify(fs.readFile),
	writeFile = Promise.promisify(fs.writeFile),
	key = '***REMOVED***',
	config = {};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

exports.path = path.resolve(__dirname, 'config.json');



/**
 * Reads the configuration file.
 * @param {Boolean} [extend=true] Whether or not to extend the configuration with helpers.
 * @returns {Q.Promise<Object>} A configuration object.
 */
exports.read = function (extend) {
	return readFile(exports.path, 'UTF-8').then(function (conf) {
		conf = JSON.parse(conf);
		conf.environment = conf.environment || process.env.NODE_ENV;

		// Extend by default
		if (_.isUndefined(extend) || _.isNull(extend) || (_.isBoolean(extend) && extend === true)) {
			conf.connections.mongodb.buildConnectionString = function () {
				// We build it every time so we don't hold it in memory (STIG)
				return 'mongodb://' + conf.connections.mongodb.user + ':' + crypto.decrypt(key, conf.connections.mongodb.password) + '@' + conf.connections.mongodb.host + ':' + conf.connections.mongodb.port + '/' + conf.connections.mongodb.database;
			};
		}

		return conf;
	}).catch(function (err) {
		console.error('Failed to read configuration file:', err);
		throw err;
	});
};

/**
 * Reads the configuration file synchronously.
 * @param {Boolean} [extend=true] Whether or not to extend the configuration with helpers.
 * @returns {Q.Promise<Object>} A configuration object.
 */
exports.readSync = function (extend) {
	try {
		// Read the config from the file
		var conf = JSON.parse(fs.readFileSync(exports.path, 'UTF-8'));
		conf.environment = conf.environment || process.env.NODE_ENV;

		// Extend by default
		if (_.isUndefined(extend) || _.isNull(extend) || (_.isBoolean(extend) && extend === true)) {
			conf.connections.mongodb.buildConnectionString = function () {
				// We build it every time so we don't hold it in memory (STIG)
				return 'mongodb://' + conf.connections.mongodb.user + ':' + crypto.decrypt(key, conf.connections.mongodb.password) + '@' + conf.connections.mongodb.host + ':' + conf.connections.mongodb.port + '/' + conf.connections.mongodb.database;
			}
		}

		return conf;
	} catch (err) {
		console.error('Failed to read configuration file:', err);
		return null;
	}
};

/**
 * Writes the configuration file.
 * @param {Object} obj Key value pairs containing dotted paths and values to write to the configuration.
 * @returns {Q.Promise<>}
 */
exports.write = function (obj) {
	if (!obj) {
		return Promise.reject(new Error('No obj was specified'));
	} else {
		return exports.read(false).then(function (conf) {
			if (!conf) {
				throw new Error('Failed to read configuration');
			} else {
				// Loop through key values pairs setting dotted paths with the values
				_.each(obj, function (value, dottedPath) {
					objectPath.set(conf, dottedPath, value);
				});

				// Write the file out (prettified)
				return writeFile(exports.path, JSON.stringify(conf, null, 4));
			}
		}).catch(function (err) {
			console.error('Failed to write configuration file:', err);
			throw err;
		});
	}
};

/**
 * Overwrites the configuration file.
 * @param {Object} obj The configuration
 * @returns {Q.Promise<>}
 */
exports.overwrite = function (obj) {
	return writeFile(exports.path, JSON.stringify(obj, null, 4)).catch(function (err) {
		console.error('Failed to overwrite configuration file:', err);
		throw err;
	});
};

/**
 * Writes the configuration file synchronously.
 * @param {Object} obj Key value pairs containing dotted paths and values to write to the configuration.
 */
exports.writeSync = function (obj) {
	var error;

	if (!obj) {
		error = 'No obj was specified';
	} else {
		var conf = exports.readSync(false);

		if (!conf) {
			error = 'Failed to read configuration';
		} else {
			try {
				// Loop through key values pairs setting dotted paths with the values
				_.each(obj, function (value, dottedPath) {
					objectPath.set(conf, dottedPath, value);
				});

				fs.writeFileSync(exports.path, JSON.stringify(conf, null, 4));
			} catch (err) {
				error = err;
			}
		}
	}

	if (error) {
		console.error('Failed to write configuration file:', error);

		throw _.isString(error) ? new Error(error) : error;
	}
};

/**
 * Gets the cached configuration.
 * @returns {Object} The configuration object.
 */
exports.get = function () {
	return config;
};

config = exports.readSync(true);
