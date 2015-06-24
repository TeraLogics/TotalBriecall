'use strict';

/* globals
 define, brie
 */

define(['ejs', 'moment', 'URI'], function (ejs, moment, Uri, require) {
	var RecallSummaryProvider = function (recall, states) {
			this._recall = recall;
			this._states = states;
		},
		_getBaseURL = function () {
			return window.location.origin ? window.location.origin : new Uri(window.location.href).authority();
		};
	RecallSummaryProvider.prototype.getFirmAddress = function () {
		return this._recall.city + ', ' + this._recall.state + ', ' + this._recall.country;
	};
	RecallSummaryProvider.prototype.isCollapsed = function () {
		return this._states.collapsed || false;
	};
	RecallSummaryProvider.prototype.isPinned = function () {
		return this._states.pinned || false;
	};
	RecallSummaryProvider.prototype.getFirmName = function () {
		return this._recall.recalling_firm;
	};
	RecallSummaryProvider.prototype.getRecallId = function () {
		return this._recall.id;
	};
	RecallSummaryProvider.prototype.getRecallNumber = function () {
		return this._recall.recall_number;
	};
	RecallSummaryProvider.prototype.getFdaId = function () {
		return this._recall.openfda_id;
	};
	RecallSummaryProvider.prototype.getProductDescription = function () {
		return this._recall.product_description;
	};
	RecallSummaryProvider.prototype.getRecallInitiationDate = function (format) {
		return moment.unix(this._recall.recall_initiation_date).format(format || 'MMMM Do, YYYY');
	};
	RecallSummaryProvider.prototype.getReasonForRecall = function () {
		return this._recall.reason_for_recall;
	};
	RecallSummaryProvider.prototype.getRecallDetailsLink = function () {
		return '/details/' + encodeURIComponent(this.getRecallId());
	};
	RecallSummaryProvider.prototype.getShareTitle = function () {
		return this._recall.product_description;
	};
	RecallSummaryProvider.prototype.getShareLink = function () {
		return _getBaseURL() + this.getRecallDetailsLink();
	};
	RecallSummaryProvider.prototype.getFacebookShareLink = function () {
		// TODO share instead of feed?
		return ejs.render('http://www.facebook.com/dialog/feed?' + [
				'app_id=<%=app_id%>',
				'redirect_uri=<%=redirect_uri%>',
				'display=popup',
				'link=<%=link%>',
				'name=<%=name%>',
				'caption=<%=caption%>',
				'description=<%=description%>',
				'picture=<%=picture%>'
			].join('&'), {
			app_id: brie.fbappid,
			redirect_uri: encodeURIComponent(_getBaseURL() + '/popupclose'), // TODO: landing page for redirection?
			link: encodeURIComponent(this.getShareLink()),
			name: encodeURIComponent('Food Recall: ' + this.getRecallNumber()),
			caption: encodeURIComponent((this.getFirmName().length < 30 ? this.getFirmName() : this.getFirmName().substr(0, 30) + '...') + ' recalls ' + (this.getProductDescription().length < 30 ? this.getProductDescription() : this.getProductDescription().substr(0, 30) + '...')),
			description: encodeURIComponent(this.getReasonForRecall().length < 100 ? this.getReasonForRecall() : this.getReasonForRecall().substr(0, 100) + '...'),
			picture: encodeURIComponent('http://canyoufreeze.com/wp-content/uploads/2014/09/brie-cheese.jpg')
		});
	};
	RecallSummaryProvider.prototype.getEmailShareLink = function () {
		return new Uri('mailto:?').query({
			subject: this.getFirmName() + ' recalls ' + this.getProductDescription(),
			body: 'On ' + this.getRecallInitiationDate('MMM Do, YYYY') + ' ' + this.getFirmName() +
				' initiated recall of ' + this.getProductDescription() + ' due to ' + this.getReasonForRecall()
		});
	};
	RecallSummaryProvider.prototype.getCardType = function () {
		switch (this._recall.classificationlevel) {
			case 1:
				return 'panel-danger';
			case 2:
				return 'panel-warning';
			case 3:
				return 'panel-info';
			default:
				return 'panel-default';
		}
	};

	return RecallSummaryProvider;
});