'use strict';

/* globals
 requirejs, brie
 */

requirejs.config({
	baseUrl: '/js',
	shim: {
		bootstrap: {'deps': ['jquery']},
		ejs: {exports: 'ejs'},
		URI: {deps: ['jquery']},
		visible: {deps: ['jquery']},
		Tour: {deps: ['bootstrap'], exports: 'Tour'},
		JasnyBootstrap: {deps: ['bootstrap', 'jquery']}
	},
	paths: {
		jquery: 'jquery-2.1.4.min',
		bootstrap: 'bootstrap.min',
		ejs: 'ejs-2.3.1.min',
		masonry: 'masonry.pkgd.min',
		moment: 'moment.min',
		select2: 'select2.min',
		underscore: 'underscore-min',
		visible: 'jquery.visible.min',
		bluebird: 'bluebird.min',
		UsStates: 'us-states',
		Tour: 'bootstrap-tour.min',
		BrowseTour: 'tour-browse',
		JasnyBootstrap: 'jasny-bootstrap.min'
	}
});

requirejs([
	'jquery',
	'bootstrap',
	'ejs',
	'masonry',
	'moment',
	'underscore',
	'CommentProvider',
	'MapApp',
	'SyncFileReader',
	'UsStates',
	'JasnyBootstrap'
], function ($, bootstrap, ejs, Masonry, moment, _, CommentProvider, MapApp, SyncFileReader, UsStates, JasnyBootstrap) {
	$.fn.serializeObject = function () {
		var o = {},
			a = this.serializeArray();

		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});

		return o;
	};

	var map = new MapApp({
			height: 300,
			width: 600,
			div: 'map'
		}),
		commentCardTemplate = ejs.compile(SyncFileReader.request('/templates/comment-card.ejs')),
		style = function () {
			return {
				fillColor: '#800026', //feature.properties.name ? '#800026' : null,
				weight: 1,
				opacity: 1,
				color: 'white',
				//dashArray: '3',
				fillOpacity: 0.7
			};
		},
		$form = $('form'),
		recallCategoriesView = $('#recall-categories'),
		recallCategoriesMasonry = new Masonry(recallCategoriesView[0], {
			itemSelector: '.recall-category-card'
		});

	map.create({
		zoomControl: false
	});

	if (brie.page.recall.affectedstates && !brie.page.recall.affectednationally) {
		map.add('layer', UsStates.getStateGeoJSON(brie.page.recall.affectedstates), {
			style: style
		});
	} else {
		map.add('layer', UsStates.getUsNationGeoJSON(), {
			style: style
		});
	}

	/* disable moving the header map */
	map._map.dragging.disable();
	map._map.touchZoom.disable();
	map._map.doubleClickZoom.disable();
	map._map.scrollWheelZoom.disable();
	map._map.boxZoom.disable();
	map._map.keyboard.disable();
	if (map._map.tap) {
		map._map.tap.disable();
	}

	$form.submit(function () {
		var $this = $(this);

		$.ajax({
			method: 'PUT',
			url: '/api/comments',
			contentType: 'application/json',
			data: JSON.stringify($this.serializeObject())
		}).done(function (comment) {
			$('#recall-comments').prepend(commentCardTemplate({ commentProvider: new CommentProvider(comment) }));
		}).fail(function (err) {
			// display a meaningful error
		});
	});

	$form.find('textarea').keydown(function (e) {
		if (e.ctrlKey && e.keyCode === 13) {
			$form.submit();
		}
	});
});