'use strict';

requirejs.config({
	baseUrl: '/js',
	shim: {
		bootstrap: {'deps': ['jquery']},
		ejs: {exports: 'ejs'},
		URI: {deps: ['jquery']},
		visible: {deps: ['jquery']}
	},
	paths: {
		jquery: 'jquery-2.1.4.min',
		bootstrap: 'bootstrap.min',
		ejs: 'ejs-2.3.1.min',
		moment: 'moment.min',
		masonry: 'masonry.pkgd.min',
		underscore: 'underscore-min',
		visible: 'jquery.visible.min',
		bluebird: 'bluebird.min',
		UsStates: 'us-states'
	}
});

requirejs([
	'jquery',
	'underscore',
	'ejs',
	'UsStates',
	'Geocode',
	'bootstrap'
], function ($,
			 _,
			 ejs,
			 UsStates,
			 GeoCode,
			 bootstrap) {
	function handleGeoLocError() {
		$('#status').hide();
		PromptForZip();
	}

	$(document).ready(function () {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(GetLatLon, handleGeoLocError, { timeout: 1500, enableHighAccuracy: false, maximumAge: 30000 });
		} else {
			handleGeoLocError();
		}
	});

	function GetLatLon(location) {
		$('#status').hide();
		GeoCode.latlon({
			lat: location.coords.latitude,
			lon: location.coords.longitude
		}).then(function (state) {
			HidePromptForZip();
			SaveState(state).then(function(){
				window.location = '/browse';
			}).fail(function(err){
				PromptForZip();
			});
		}).fail(function () {
			PromptForZip();
		});
	}

	function GetZipcode(zipcode) {
		GeoCode.zipcode(zipcode).then(function (state) {
			HidePromptForZip();
			SaveState(state).then(function(){
				window.location = '/browse';
			}).fail(function(err){
				PromptForZip();
			});
		}).fail(function () {
			alert('Failed to find zipcode. Please try again.');
			$('#zipcodeInput').val("");
			PromptForZip();
		});
	}

	function SaveState(state) {
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

	function PromptForZip() {
		$('#zipcodeModal').modal('show');
	}

	function HidePromptForZip() {
		$('#zipcodeModal').modal('hide');
	}

	$('#zipcodeModal').on('shown.bs.modal', function () {
		$('#zipcodeInput').focus();
	});

	$('#zipcodeModal').modal({
		backdrop: 'static',
		keyboard: false
	})

	$('#zipcodeForm').submit(function () {
		GetZipcode($('#zipcodeInput').val());
	});
});