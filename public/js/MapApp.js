'use strict';

/* globals
 define, L
 */

define(['jquery', 'underscore', 'leaflet'], function ($, _, visible, leaflet) {
	function MapApp(options) {
		L.Icon.Default.imagePath = '/img/leaflet';
		var self = this;
		self._options = _.extend({
			name: 'MapApp' + Date.now(), //give each map instance its own name
			div: 'map', //default div to add map to
			lat: 38.8968331, //default to the GSA building on 18th and F St
			lon: -77.042261,
			zoom: 17,
			height: 200, //default map size
			width: 200
		}, options);
		self._map = null;
		self._features = null;
		self.Mediator = (function () {
			var subscribe = function (channel, fn) {
					if (!self.Mediator.channels[channel]) {
						self.Mediator.channels[channel] = [];
					}
					self.Mediator.channels[channel].push({
						context: this,
						callback: fn
					});
					return this;
				},

				publish = function (channel) {
					if (!self.Mediator.channels[channel]) {
						return false;
					}
					var args = Array.prototype.slice.call(arguments, 1);
					for (var i = 0, l = self.Mediator.channels[channel].length; i < l; i++) {
						var subscription = self.Mediator.channels[channel][i];
						subscription.callback.apply(subscription.context, args);
					}
					return this;
				};

			return {
				channels: {},
				publish: publish,
				subscribe: subscribe
			};

		}());

		self._createMap = function (options) {
			if (self._map) { //if already created, do nothing
				return false;
			}

			var div = $('<div id="' + self._options.name + '"></div>') //create a new div
				.height(self._options.height) //set the div height and width
				.width(self._options.width)
				.appendTo($('#' + self._options.div)) //add it to the one provided by the user
				.get(0); //and get the DOM object
			options = options || {};

			self._map = L.map(div, options); //create the Leaflet map
			self._map.attributionControl.setPrefix("");
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '<div title="http://osm.org/copyright | &copy; OpenStreetMap contributors"><i class="glyphicon glyphicon-info-sign"></i></div>'
			}).addTo(self._map);

			return true;
		};

		self._updateMap = function (obj) {
		};

		self._deleteMap = function () {
			if (!self._map) { //if already uninitialized do nothing
				return false;
			}
			self._map = null;
			$('#' + self._options.name).remove();
			self._features = null;
			return true;
		};

		self._addMarker = function (obj) {
			L.marker([
				obj.lat,
				obj.lon
			]).addTo(self._map)
				.bindPopup(obj.message)
				.openPopup();
			self._map.setView([
				obj.lat,
				obj.lon
			], 17);
		};

		self._addLayer = function (obj, options) {
			var layer = L.geoJson(obj, options);
			layer.addTo(self._map);
			self._map.fitBounds(layer.getBounds());
		};

		self._deleteFeature = function (obj) {
		};

		self._deleteAllFeatures = function () {
		};
	}

	MapApp.prototype.create = function (options) {
		this._createMap(options);
	};

	MapApp.prototype.update = function (obj) {
		this._updateMap(obj);
	};

	MapApp.prototype.delete = function () {
		this._deleteMap();
	};

	MapApp.prototype.add = function (type, obj, options) {
		switch (type) {
			case 'marker':
				this._addMarker(obj, options);
				break;
			case 'layer':
				this._addLayer(obj, options);
				break;
		}
	};

	MapApp.prototype.remove = function (obj) {
		if (!obj) {
			this._deleteAllFeatures();
		} else {
			this._deleteFeature(obj);
		}
	};

	return MapApp;
});