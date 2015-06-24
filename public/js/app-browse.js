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
		UsStates: 'us-states',
		Tour: 'bootstrap-tour.min',
		BrowseTour: 'tour-browse'
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
	'UsStates',
	'BrowseTour'
], function (Promise,
			 bootstrap,
			 ejs,
			 $,
			 MapApp,
			 moment,
			 Masonry,
			 RecallSummaryProvider,
			 Sisyphus,
			 SyncFileReader,
			 UsStates,
			 BrowseTour
) {
	function addRecentRecalls(recalls) {
		var recallCards = [],
			collapsedRecalls = getPreference('collapsedrecalls', []);

		recentRecallsView.removeClass('empty');

		for (var i = 0, l = recalls.length; i < l; i++) {
			var cardView = $('<li class="recall-card col-xs-12 col-sm-6 col-lg-4">').append(
				recallCardTemplate({summaryProvider: new RecallSummaryProvider(recalls[i], {
					collapsed: _.contains(collapsedRecalls, recalls[i].openfda_id)
				})}));

			recallCards.push(cardView.get(0));

			recentRecallsView.append(cardView);
			recentRecallsMasonry.appended(cardView.get(0));
		}

		recentRecallsMasonry.layout();
	}

	function setPreference(pref, value) {
		if (!brie.preferences) {
			brie.preferences = {};
		}

		brie.preferences[pref] = value;

		return _syncPreferences();
	}

	function getPreference(pref, dflt) {
		if (!brie.preferences || !brie.preferences.hasOwnProperty(pref)) {
			return dflt;
		} else {
			return brie.preferences[pref];
		}
	}

	function _syncPreferences() {
		return $.ajax({
			url: '/preferences',
			type: 'POST',
			dataType: 'JSON',
			data: brie.preferences
		});
	}

	function _onRecallPin(recallId, pinned) {
		var pinnedRecalls = getPreference('pinnedrecalls', []);

		if (pinned) {
			pinnedRecalls.push(recallId);
		}
		else {
			pinnedRecalls = _.without(pinnedRecalls, recallId);
		}

		setPreference('pinnedrecalls', pinnedRecalls);
	}

	function _onRecallUnpinned(recallId) {
		var pinnedRecalls = getPreference('pinnedrecalls', []);

	}

	function _onRecallVisibility(recallId, visible) {
		var collapsedRecalls = getPreference('collapsedrecalls', []);
		if (!visible) {
			collapsedRecalls.push(recallId);
		}
		else {
			collapsedRecalls = _.without(collapsedRecalls, recallId);
		}

		setPreference('collapsedrecalls', collapsedRecalls);
	}

	var appWindow = $(window),
		appDocument = $(document),
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

			if (getPreference('state')) {
				meta.state = getPreference('state');
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

	var map = new MapApp({
		height: 100,
		width: 200,
		div: 'header-map'
	});

	map.create({
		zoomControl: false
	});

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

	if (getPreference('state')) {
		map.add('layer', UsStates.getStateGeoJSON([getPreference('state')]), {
			style: style
		});
	} else {
		map.add('layer', UsStates.getNationGeoJSON(), {
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

	pinnedRecallsView.on('shown.bs.collapse hidden.bs.collapse', '.recall-card .collapse', function (event) {
		var element = $(this),
			visible = event.type === 'shown',
			recallId = element.data('recallId');

		eventTrolley.triggerHandler(visible ? 'shown.recall.pinned' : 'hidden.recall.pinned', {recallId: recallId});
	});
	recentRecallsView.on('shown.bs.collapse hidden.bs.collapse', '.recall-card .collapse', function (event) {
		var element = $(this),
			visible = event.type === 'shown',
			recallId = element.data('recallId');

		eventTrolley.triggerHandler(visible ? 'shown.recall.recent' : 'hidden.recall.recent', {recallId: recallId});
	});

	eventTrolley.on('hidden.recall.pinned', function (event, data) {
		_onRecallVisibility(data.recallId, false);
		pinnedRecallMasonry.layout();
	}).on('shown.recall.pinned', function (event, data) {
		_onRecallVisibility(data.recallId, true);
		pinnedRecallMasonry.layout();
	}).on('hidden.recall.recent', function (event, data) {
		_onRecallVisibility(data.recallId, false);
		recentRecallsMasonry.layout();
	}).on('shown.recall.recent', function (event, data) {
		_onRecallVisibility(data.recallId, true);
		recentRecallsMasonry.layout();
	});

	// Hook up general controls
	appView.on('click', '[data-action="recall-copy"]', function (event) {
		recallLinkCopyModal.modal('show');
	});
	appView.on('click', '[data-action="recall-pin"]', function (event) {
		var element = $(this),
			recallId = element.data('recallId');
	});

	appDocument.ready(function () {
		BrowseTour.start();
	});
});