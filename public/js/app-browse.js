'use strict';

/* globals
 requirejs, brie, _
 */

requirejs.config({
	baseUrl: '/js',
	shim: {
		bootstrap: { 'deps': ['jquery'] },
		ejs: { exports: 'ejs' },
		URI: { deps: ['jquery'] },
		visible: { deps: ['jquery'] },
		Tour: { deps: ['bootstrap'], exports: 'Tour' },
	},
	paths: {
		jquery: 'jquery-2.1.4.min',
		bootstrap: 'bootstrap.min',
		ejs: 'ejs-2.3.1.min',
		moment: 'moment.min',
		masonry: 'masonry.pkgd.min',
		select2: 'select2.min',
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
	'select2',
	'RecallProvider',
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
			select2,
			RecallProvider,
			Sisyphus,
			SyncFileReader,
			UsStates,
			BrowseTour) {

	function _generateRecallCards(recalls) {
		var cards = [],
			collapsedRecalls = getPreference('collapsedrecalls', []),
			pinnedRecalls = getPreference('pinnedrecalls', []);

		if (Object.prototype.toString.call(recalls) !== '[object Array]') {
			recalls = [recalls];
		}

		for (var i = 0, l = recalls.length; i < l; i++) {
			var collapsed = _.contains(collapsedRecalls, recalls[i].openfda_id),
				pinned = _.contains(pinnedRecalls, recalls[i].openfda_id),
				cardView = null;

			cardView = $('<li class="recall-card col-xs-12 col-sm-6 col-lg-4">').append(
				recallCardTemplate({
					recallProvider: new RecallProvider(
						recalls[i], {
							collapsed: collapsed,
							pinned: pinned
						}
					)
				})
			).data('recall-data', recalls[i]);

			cards.push(cardView);
		}

		return $(cards);
	}

	function _addRecallCardsToView(view, cards) {
		for (var i = 0, l = cards.length; i < l; i++) {
			view.append(cards[i]);
		}
	}

	function _layoutAddedRecallCards(masonry, cards) {
		cards.each(function (index, element) {
			masonry.appended(element);
		});

		masonry.layout();
	}

	function _layoutRemovedRecallCards(masonry, cards) {
		cards.each(function (index, element) {
			masonry.remove(element);
		});

		masonry.layout();
	}

	function addRecalls(view, masonry, recalls) {
		var recallCards = _generateRecallCards(recalls);

		_addRecallCardsToView(recentRecallsView, recallCards);
		_layoutAddedRecallCards(recentRecallsMasonry, recallCards);
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
		pinnedRecallsMasonry = new Masonry(pinnedRecallsView[0], {
			itemSelector: '.recall-card'
		}),
		recentRecallsView = $('#recent-recalls'),
		recentRecallsMasonry = new Masonry(recentRecallsView[0], {
			itemSelector: '.recall-card'
		}),
		recentRecallLoadingView = $('#recent-recalls + .list-view-messages > .list-view-loading-message'),
		eventTrolley = $({}),
		recallLinkCopyModal = $('#recall-link-copy');

	$(".select2.categories").select2({
		tags: brie.page.categories,
		tokenSeparators: [',', ' ']
	});

	recallLinkCopyModal.find('[name="recall-link"]').on('click', function (event) {
		this.select();
	});

	// Setup infini-scroll
	new Sisyphus(appWindow, {
		trigger: recentRecallLoadingView,
		autoTrigger: true,
		onFetch: function (meta, sisyphus) {
			meta.status = 'ongoing';
			
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
			recentRecallsView.toggleClass('empty', (
				result.data.length === 0 && recentRecallsView.children().length === 0
			));

			if (result.data.length === 0) {
				sisyphus.stop();
			}
			else {
				addRecalls(recentRecallsView, recentRecallsMasonry, result.data);
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

		eventTrolley.triggerHandler(visible ? 'shown.recall.pinned' : 'hidden.recall.pinned', { recallId: recallId });
	});
	recentRecallsView.on('shown.bs.collapse hidden.bs.collapse', '.recall-card .collapse', function (event) {
		var element = $(this),
			visible = event.type === 'shown',
			recallId = element.data('recallId');

		eventTrolley.triggerHandler(visible ? 'shown.recall.recent' : 'hidden.recall.recent', { recallId: recallId });
	});

	eventTrolley.on('hidden.recall.pinned', function (event, data) {
		_onRecallVisibility(data.recallId, false);
		pinnedRecallsMasonry.layout();
	}).on('shown.recall.pinned', function (event, data) {
		_onRecallVisibility(data.recallId, true);
		pinnedRecallsMasonry.layout();
	}).on('hidden.recall.recent', function (event, data) {
		_onRecallVisibility(data.recallId, false);
		recentRecallsMasonry.layout();
	}).on('shown.recall.recent', function (event, data) {
		_onRecallVisibility(data.recallId, true);
		recentRecallsMasonry.layout();
	});

	// Hook up general controls
	appView.on('click', '[data-action="recall-copy"]', function (event) {
		var element = $(this),
			text = element.data('text'),
			recallLinkInput = recallLinkCopyModal.find('[name="recall-link"]');

		recallLinkInput.val(text);

		recallLinkCopyModal.modal('show');

		return false;
	});
	appView.on('click', '[data-action="recall-pin"]', function (event) {
		var element = $(this),
			recallId = element.data('recallId'),
			cardView = element.closest('.recall-card'),
			recallData = cardView.data('recall-data');

		if (!element.hasClass('active')) {
			_layoutRemovedRecallCards(recentRecallsMasonry, cardView);
			recentRecallsView.toggleClass('empty', (recentRecallsView.children().length === 0 ));

			cardView = _generateRecallCards(recallData);

			pinnedRecallsView.toggleClass('empty', false);
			_addRecallCardsToView(pinnedRecallsView, cardView);
			_layoutAddedRecallCards(pinnedRecallsMasonry, cardView);
			_onRecallPin(recallId, true);
		}
		else {
			_layoutRemovedRecallCards(pinnedRecallsMasonry, cardView);
			pinnedRecallsView.toggleClass('empty', (pinnedRecallsView.children().length === 0 ));

			cardView = _generateRecallCards(recallData);

			recentRecallsView.toggleClass('empty', false);
			_addRecallCardsToView(recentRecallsView, cardView);
			_layoutAddedRecallCards(recentRecallsMasonry, cardView);
			_onRecallPin(recallId, false);
		}
	});

	appDocument.ready(function () {
		// Tooltip heaven
		appView.tooltip({
			selector: '[rel=tooltip]'
		});

		BrowseTour.start();
	});
});