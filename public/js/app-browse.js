'use strict';

requirejs.config({
	baseUrl: 'js',
	shim: {
		bootstrap: {'deps': ['jquery']},
		ejs: {exports: 'ejs'},
		URI: {deps: ['jquery']}
	},
	paths: {
		jquery: 'jquery-2.1.4.min',
		bootstrap: 'bootstrap.min',
		ejs: 'ejs-2.3.1.min',
		moment: 'moment.min',
		masonry: 'masonry.pkgd.min',
		underscore: 'underscore-min'
	}
});

requirejs([
	'jquery',
	'bootstrap',
	'ejs',
	'moment',
	'masonry',
	'RecallSummaryProvider',
	'Sisyphus',
	'SyncFileReader'
], function ($,
			 bootstrap,
			 ejs,
			 moment,
			 Masonry,
			 RecallSummaryProvider,
			 Sisyphus,
			 SyncFileReader) {
	var recallCardTemplate = ejs.compile(SyncFileReader.request('/templates/recall-summary-card.ejs')),
		pinnedRecallsView = $('#pinned-recalls'),
		pinnedRecallMasonry = new Masonry(pinnedRecallsView[0], {
			itemSelector: '.recall-card'
		}),
		recentRecallsView = $('#recent-recalls'),
		recentRecallsMasonry = new Masonry(recentRecallsView[0], {
			itemSelector: '.recall-card'
		});

	// Setup infini-scroll
	new Sisyphus(recentRecallsView, {
		autoTrigger: true,
		onTrigger: function () {

		},
		onRender: function () {

		}
	});

	$.ajax({
		url: '/api/recalls',
		data: {
			skip: 0,
			limit: 15
		}
	}).then(function (data) {
		try {
			recentRecallsView.removeClass('empty');
			for (var i = 0, l = data.data.length; i < l; i++) {
				var cardView = $(recallCardTemplate({summaryProvider: new RecallSummaryProvider(data.data[i])})),
					blah = $('<li class="recall-card col-xs-12 col-sm-6 col-lg-4">').append(cardView);

				blah.appendTo(recentRecallsView);
				recentRecallsMasonry.appended(blah);
				recentRecallsMasonry.layout();
			}
		}
		catch (e) {
			console.error(e);
		}
	}, function (error) {

	});
});