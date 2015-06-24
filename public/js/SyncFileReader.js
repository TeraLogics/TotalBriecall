'use strict';

/* globals
 define, ActiveXObject
 */

define(function () {
	return {
		_newRequest: function () {
			var factories = [
				function () {
					return new ActiveXObject("Msxml2.XMLHTTP");
				},
				function () {
					return new XMLHttpRequest();
				},
				function () {
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
			];

			for (var i = 0; i < factories.length; i++) {
				try {
					var request = factories[i]();
					if (request !== null) {
						return request;
					}
				}
				catch (e) {
					continue;
				}
			}
		},
		request: function (path) {
			var request = new this._newRequest();
			request.open("GET", path, false);

			try {
				request.send(null);
			}
			catch (e) {
				return null;
			}

			if (request.status === 404 || request.status === 2 || (request.status === 0 && request.responseText === '')) {
				return null;
			}

			return request.responseText;
		}
	};
});