'use strict';

/* globals
 requirejs
 */

requirejs([
	'jquery',
	'underscore',
	'ejs',
	'UsStates',
	'Geocode',
	'bootstrap',
	'JasnyBootstrap'
], function ($, _, ejs, UsStates, GeoCode, bootstrap, JasnyBootstrap) {
	function handleGeoLocError() {
		$('#status').hide();
		promptForZip();
	}

	$(document).ready(function () {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(getLatLon, handleGeoLocError, { timeout: 1500, enableHighAccuracy: false, maximumAge: 30000 });
		} else {
			handleGeoLocError();
		}
	});

	function getLatLon(location) {
		$('#status').hide();
		GeoCode.latlon({
			lat: location.coords.latitude,
			lon: location.coords.longitude
		}).then(function (state) {
			hidePromptForZip();
			saveState(state).then(function () {
				window.location = '/browse';
			}).fail(function (err) {
				promptForZip();
			});
		}).fail(function () {
			promptForZip();
		});
	}

	function getZipcode(zipcode) {
		GeoCode.zipcode(zipcode).then(function (state) {
			hidePromptForZip();
			saveState(state).then(function () {
				window.location = '/browse';
			}).fail(function (err) {
				promptForZip();
			});
		}).fail(function () {
			alert('Failed to find zipcode. Please try again.');
			$('#zipcodeInput').val("");
			promptForZip();
		});
	}

	function saveState(state) {
		var deferred = $.Deferred();

		$.ajax({
			type: 'POST',
			url: '/preferences',
			data: {
				state: state
			},
			dataType: 'JSON'
		}).then(function () {
			return deferred.resolve();
		}).fail(function (err) {
			return deferred.reject(err);
		});

		return deferred;
	}

	function promptForZip() {
		$('#zipcodeModal').modal('show');
	}

	function hidePromptForZip() {
		$('#zipcodeModal').modal('hide');
	}

	$('#zipcodeModal').on('shown.bs.modal', function () {
		$('#zipcodeInput').focus();
	});

	$('#zipcodeModal').modal({
		backdrop: 'static',
		keyboard: false
	});

	$('#zipcodeForm').submit(function () {
		getZipcode($('#zipcodeInput').val());
	});
});