'use strict';

/* globals
 requirejs
 */

requirejs.config({
    baseUrl: '/js',
    shim : {
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
    'moment',
    'masonry',
    'RecallSummaryProvider',
    'Sisyphus',
    'SyncFileReader'
], function (Promise,
    bootstrap,
    ejs,
    $,
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
        eventTrolley = $({});

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

			meta.state = state;

            return $.ajax({
                url: '/api/recalls',
                data: meta
            });
        },
        onProcess: function (result, meta, sisyphus) {
            if (result.data.length === 0) {
                sisyphus.stop();
            }
            else {
                addRecentRecalls(result.data);
                //sisyphus.rebind();
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
});