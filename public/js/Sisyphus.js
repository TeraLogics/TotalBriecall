'use strict';

/* globals
 define
 */

define(['jquery'], function ($) {
	var Sisyphus = function (element, options) {
		var self = this;

		self._element = element;

		self._options = $.extend({}, Sisyphus.DEFAULT_OPTIONS, options || {});
		self._meta = {};

		// bind to scroll
		this.rebind();

		this._checkTrigger();
	};
	Sisyphus.DEFAULT_OPTIONS = {
		trigger: null,
		autoTrigger: true,
		onFetch: $.noop,
		onProcess: $.noop,
		onError: $.noop
	};
	Sisyphus.prototype._checkTrigger = function () {
		if (this._options.trigger.visible(true)) {
			this._element.off('scroll', $.proxy(this._onScroll, this));
			this._onTrigger();
		}
	};
	Sisyphus.prototype._onScroll = function () {
		this._checkTrigger();
	};
	Sisyphus.prototype._fetch = function () {
		return this._options.onFetch(this._meta, this);
	};
	Sisyphus.prototype._bind = function () {

	};
	Sisyphus.prototype.rebind = function () {
		this._element.off('scroll', $.proxy(this._onScroll, this))
			.on('scroll', $.proxy(this._onScroll, this));
		this._checkTrigger();
	};
	Sisyphus.prototype.destroy = function () {

	};
	Sisyphus.prototype._onTrigger = function () {
		var self = this;

		self._fetch().then(function (result) {
			self._options.onProcess(result, self._meta, self);
		}, function (error) {
			self._options.onError(error, self._meta, self);
		});
	};

	return Sisyphus;
});