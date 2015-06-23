'use strict';

/* globals
 _, $
 */

/* exported
 GeoCode
 */

var GeoCode = {
	latlon: function (obj) {
		var deferred = $.Deferred();

		if (!_.isNumber(obj.lat) || !_.isNumber(obj.lon)) {
			return deferred.reject();
		}
		$.ajax({
			type: 'GET',
			url: 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + obj.lat + '&lon=' + obj.lon,
			dataType: 'JSON' //use text so we can simply regex match the state
		}).done(function (data) {
			if (!data || !data.address) {
				return deferred.reject();
			}
			var state = data.address.state.length === 2 ? data.address.state : stateNameToAbbr[data.address.state];
			return deferred.resolve(state);
		}).fail(function (err) {
			return deferred.reject(err);
		});

		return deferred;
	},
	zipcode: function (zipcode) {
		var deferred = $.Deferred();

		if (!zipcode) {
			return deferred.reject();
		}
		$.ajax({
			type: 'GET',
			url: 'http://production.shippingapis.com/ShippingAPITest.dll?API=CityStateLookup&XML=%3CCityStateLookupRequest%20USERID=%22' + uspsuser + '%22%3E%20%3CZipCode%20ID=%20%220%22%3E%20%3CZip5%3E' + zipcode + '%3C/Zip5%3E%20%3C/ZipCode%3E%20%3C/CityStateLookupRequest%3E',
			dataType: 'text' //use text so we can simply regex match the state
		}).done(function (data) {
			var match = data.match(/<State>(.*)<\/State>/);
			if (!match || match.length === 1) { //check the regex matched more than itself
				return deferred.reject();
			}

			var state = match[1].length === 2 ? match[1] : stateNameToAbbr[match[1]];
			return deferred.resolve(state);
		}).fail(function (err) {
			return deferred.reject(err);
		});

		return deferred;
	}
};