'use strict';

requirejs.config({
	baseUrl: '/js',
	shim: {
		'bootstrap': {'deps': ['jquery']}
	},
	paths: {
		jquery: 'jquery-2.1.4.min',
		bootstrap: 'bootstrap.min',
		underscore: 'underscore-min',
		UsStates: 'us-states'
	}
});

requirejs(['jquery', 'bootstrap', 'underscore', 'MapApp', 'UsStates'], function ($, bootstrap, _, MapApp, UsStates) {
	var map = new MapApp({
		height: 300,
		width: 600,
		div: 'map'
	});

	map.create();
	
	var style = function (feature) {
		return {
			fillColor: '#800026', //feature.properties.name ? '#800026' : null,
			weight: 1,
			opacity: 1,
			color: 'white',
			//dashArray: '3',
			fillOpacity: 0.7
		};
	};

	if (states) {
		map.add('layer', UsStates.getStateGeoJSON(states), {
			style: style
		});
	} else {
		map.add('layer', UsStates.getNationGeoJSON(), {
			style: style
		});
	}
});