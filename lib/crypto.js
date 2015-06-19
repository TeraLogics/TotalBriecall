'use strict';

var crypto = require("crypto");

/**
 * Crypto constructor
 * @param opts The options
 * @returns {Crypto}
 * @constructor
 */
var Crypto = function(opts) {
	opts = (opts === Object(opts)) ? opts : {};

	if (!(this instanceof Crypto)) {
		return new Crypto(opts);
	}

	this.opts = opts;
	this.iv = new Buffer('e530ecd4f7484221');
	this.algorithm = 'aes-256-cbc';
};

/**
 * Gets the options
 * @returns {Function} Return the options that were passed in when the object was created
 */
Crypto.prototype.opts = function() {
	return this.opts;
};

/**
 * Decrypts cipher text
 * @param {String} key The encryption key
 * @param {String} ciphertext The cipher text
 * @returns {String} Return the decrypted cipher text
 */
Crypto.prototype.decrypt = function(key, ciphertext) {
	if (!Buffer.isBuffer(key)) {
		key = new Buffer(key);
	}

	if (!Buffer.isBuffer(ciphertext)) {
		ciphertext = new Buffer(ciphertext, 'hex');
	}

	var decipher = crypto.createDecipheriv(this.algorithm, key, this.iv);
	return decipher.update(ciphertext) + decipher.final();
};

/**
 * Encrypts plain text
 * @param {String} key The decryption key
 * @param {String} plaintext The plain text
 * @return {String} Return the encrypted plain text
 */
Crypto.prototype.encrypt = function(key, plaintext) {
	if (!Buffer.isBuffer(key)) {
		key = new Buffer(key);
	}

	if (!Buffer.isBuffer(plaintext)) {
		plaintext = new Buffer(plaintext);
	}

	var cipher = crypto.createCipheriv(this.algorithm, key, this.iv);
	return cipher.update(plaintext, null, 'hex') + cipher.final('hex');
};

/**
 * Exports crypto
 * @type {Function}
 */
module.exports = Crypto;