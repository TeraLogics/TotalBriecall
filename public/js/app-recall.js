'use strict';

/* globals
 requirejs
 */

requirejs([
	'brie-core',
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
], function (BrieCore, $, bootstrap, ejs, Masonry, moment, _, CommentProvider, MapApp, SyncFileReader, UsStates, JasnyBootstrap) {
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
		}),
		recallLinkCopyModal = $('#recall-link-copy');

	recallLinkCopyModal.find('[name="recall-link"]').on('click', function (event) {
		this.select();
	});

	map.create({
		zoomControl: false
	});

	if (BrieCore.page.recall.affectedstates && !BrieCore.page.recall.affectednationally) {
		map.add('layer', UsStates.getStateGeoJSON(BrieCore.page.recall.affectedstates), {
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

	// Hook up general controls
	$('.application').on('click', '[data-action="recall-copy"]', function (event) {
		var element = $(this),
			text = element.data('text'),
			recallLinkInput = recallLinkCopyModal.find('[name="recall-link"]');

		recallLinkInput.val(text);

		recallLinkCopyModal.modal('show');

		return false;
	});

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