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
	$(document).ready(function () {
		$('#stateModal').on('shown.bs.modal', function () {
			$('#stateInput').focus();
		});

		$('#stateModal').modal({
			backdrop: 'static',
			keyboard: false
		});

		$('#stateAutomaticLocation').click(function () {
			promptForGeolocation();
		});

		$('#stateForm').submit(function () {
			var state = $('#stateInput').val();
			saveState(state).then(function () {
				window.location = '/browse';
			}).fail(function (err) {
				//if there is an error send a blank state, meaning Nationwide
				saveState("").then(function () {
					window.location = '/browse';
				}).fail(function (err) {
					//need to refresh page?
				});
			});
		});

		$('#stateModal').modal('show');
	});

	/*
	//USPS zipcode lookup is fully working but we removed it due to the usps.gov not supporting HTTPS
	function getstate(state) {
		GeoCode.state(state).then(function (state) {
			hidepromptForGeolocation();
			saveState(state).then(function () {
				window.location = '/browse';
			}).fail(function (err) {
				promptForGeolocation();
			});
		}).fail(function () {
			alert('Failed to find state. Please try again.');
			$('#stateInput').val("");
			promptForGeolocation();
		});
	}
	*/

	function promptForGeolocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(getLatLon, handleGeoLocError, { timeout: 1500, enableHighAccuracy: false, maximumAge: 30000 });
		} else {
			handleGeoLocError();
		}
	}

	function handleGeoLocError() {
		$('#stateAutomaticLocation').addClass('disabled').html("Detection Failed");
		$('#stateInput').focus();
	}

	function getLatLon(location) {
		GeoCode.latlon({
			lat: location.coords.latitude,
			lon: location.coords.longitude
		}).then(function (state) {
			$('#stateInput').val(state);
		}).fail(function () {
			handleGeoLocError();
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
});