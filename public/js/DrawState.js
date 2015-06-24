'use strict';

/* globals
 MapApp, getStateGeoJSON
 */
/* exported
 DrawState
 */

function DrawState(state, options) {
	options = options || {
			height: 200,
			width: 200
		};

	var map = new MapApp(options);
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

	map.add('layer', getStateGeoJSON([state]), {
		style: style
	});
}