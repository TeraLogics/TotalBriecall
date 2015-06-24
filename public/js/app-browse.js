'use strict';

/* globals
 requirejs, state
 */

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
		bluebird: 'bluebird.min'
	}
});

requirejs([
	'bluebird',
	'bootstrap',
	'ejs',
	'jquery',
	'MapApp',
	'moment',
	'masonry',
	'RecallSummaryProvider',
	'Sisyphus',
	'SyncFileReader',
	'us-states'
], function (Promise,
			 bootstrap,
			 ejs,
			 $,
			 MapApp,
			 moment,
			 Masonry,
			 RecallSummaryProvider,
			 Sisyphus,
			 SyncFileReader) {
	function addRecentRecalls(recalls) {
		recentRecallsView.removeClass('empty');
		var recallCards = [];

		for (var i = 0, l = recalls.length; i < l; i++) {
			var cardView = $('<li class="recall-card col-xs-12 col-sm-6 col-lg-4">').append(
				recallCardTemplate({summaryProvider: new RecallSummaryProvider(recalls[i])}));

			recallCards.push(cardView.get(0));

			recentRecallsView.append(cardView);
			recentRecallsMasonry.appended(cardView.get(0));
		}

		recentRecallsMasonry.layout();
	}

	var appWindow = $(window),
		appView = $('.application'),
		recallCardTemplate = ejs.compile(SyncFileReader.request('/templates/recall-summary-card.ejs')),
		pinnedRecallsView = $('#pinned-recalls'),
		pinnedRecallMasonry = new Masonry(pinnedRecallsView[0], {
			itemSelector: '.recall-card'
		}),
		recentRecallsView = $('#recent-recalls'),
		recentRecallsMasonry = new Masonry(recentRecallsView[0], {
			itemSelector: '.recall-card'
		}),
		recentRecallLoadingView = $('#recent-recalls + .list-view-messages > .list-view-loading-message'),
		eventTrolley = $({}),
		recallLinkCopyModal = $('#recall-link-copy');

	recallLinkCopyModal.find('[name="recall-link"]').on('click', function (event) {
		this.select();
	});

	// Setup infini-scroll
	new Sisyphus(appWindow, {
		trigger: recentRecallLoadingView,
		autoTrigger: true,
		onFetch: function (meta, sisyphus) {
			if (typeof meta.skip === 'undefined') {
				meta.skip = 0;
				meta.limit = 10;
			}
			else {
				meta.skip += meta.limit;
			}

			if (state) {
			meta.state = state;
			}

			return $.ajax({
				url: '/api/recalls',
				data: meta,
				cache: false
			});
		},
		onProcess: function (result, meta, sisyphus) {
			if (result.data.length === 0) {
				sisyphus.stop();
			}
			else {
				addRecentRecalls(result.data);
				sisyphus.rebind();
			}
		}
	});

	eventTrolley.on('hidden.recall.pinned', function () {
		pinnedRecallMasonry.layout();
	}).on('shown.recall.pinned', function () {
		pinnedRecallMasonry.layout();
	}).on('hidden.recall.recent', function () {
		recentRecallsMasonry.layout();
	}).on('shown.recall.recent', function () {
		recentRecallsMasonry.layout();
	});

	pinnedRecallsView.on('shown.bs.collapse hidden.bs.collapse', '.recall-card .collapse', function (event) {
		eventTrolley.triggerHandler(event.type === 'hidden' ? 'hidden.recall.pinned' : 'shown.recall.pinned');
	});
	recentRecallsView.on('shown.bs.collapse hidden.bs.collapse', '.recall-card .collapse', function (event) {
		eventTrolley.triggerHandler(event.type === 'hidden' ? 'hidden.recall.recent' : 'shown.recall.recent');
	});

	var map = new MapApp({
		height: 100,
		width: 200,
		div: 'header-map'
	});

	map.create({
		zoomControl: false
	});

	var style = function(feature) {
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
	appView.on('click', '[data-action="recall-copy"]', function (event) {
		recallLinkCopyModal.modal('show');
	});
	appView.on('click', '[data-action="recall-fbshare"]', function (event) {
		openFacebookDialog($(this).data('href'));
	});
	appView.on('click', '[data-action="recall-pin"]', function (event) {
		var element = $(this),
			recallId = element.data('recallId');
	});
	appView.on('click', '[data-action="recall-toggle"]', function (event) {
		var element = $(this),
			recallId = element.data('recallId');
	});

	function openFacebookDialog(link, windowname, width, height) {
		if (!window.focus) {
			return;
		}

		var href;
		if (typeof(link) === 'string') {
			href = link;
		} else {
			href = link.href;
		}

		if (!windowname) {
			windowname = 'FeedDialog';
		}

		if (!width) {
			width = 700;
		}
		if (!height) {
			height = 400;
		}

		window.open(href, windowname, 'resizable=yes,width=' + width + ',height=' + height + ',scrollbars=yes');
	}
});