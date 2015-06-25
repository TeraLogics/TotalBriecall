'use strict';

/* globals
 define, brie
 */

define(['ejs', 'moment', 'URI'], function (ejs, moment, Uri, require) {
	var RecallProvider = function (recall, states) {
			this._recall = recall;
			this._states = states;
		},
		_getBaseURL = function () {
			return window.location.origin ? window.location.origin : new Uri(window.location.href).authority();
		};
	RecallProvider.prototype.getFoodCategoryImgUrl = function () {
		var category = 'generic';

		if (this._recall.categories.length > 0) {
			category = this._recall.categories[0];
		}

		return _getBaseURL() + '/img/foodcategories/' + category + '.jpg';
	};
	RecallProvider.prototype.getFirmAddress = function () {
		return this._recall.city + ', ' + this._recall.state + ', ' + this._recall.country;
	};
	RecallProvider.prototype.isCollapsed = function () {
		return this._states.collapsed || false;
	};
	RecallProvider.prototype.isPinned = function () {
		return this._states.pinned || false;
	};
	RecallProvider.prototype.getFirmName = function () {
		return this._recall.recalling_firm;
	};
	RecallProvider.prototype.getRecallId = function () {
		return this._recall.id;
	};
	RecallProvider.prototype.getRecallNumber = function () {
		return this._recall.recall_number;
	};
	RecallProvider.prototype.getFdaId = function () {
		return this._recall.openfda_id;
	};
	RecallProvider.prototype.getProductDescription = function () {
		return this._recall.product_description;
	};
	RecallProvider.prototype.getRecallInitiationDate = function (format) {
		return moment.unix(this._recall.recall_initiation_date).format(format || 'MMMM Do, YYYY');
	};
	RecallProvider.prototype.getReasonForRecall = function () {
		return this._recall.reason_for_recall;
	};
	RecallProvider.prototype.getRecallDetailsLink = function () {
		return '/details/' + encodeURIComponent(this.getRecallId());
	};
	RecallProvider.prototype.getShareTitle = function () {
		return this._recall.product_description;
	};
	RecallProvider.prototype.getShareLink = function () {
		return _getBaseURL() + this.getRecallDetailsLink();
	};
	RecallProvider.prototype.getClassificationLevel = function () {
		return this._recall.classificationlevel;
	};
	RecallProvider.prototype.getFacebookShareLink = function () {
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
	RecallProvider.prototype.getEmailShareLink = function () {
		return new Uri('mailto:?').query({
			subject: this.getFirmName() + ' recalls ' + this.getProductDescription(),
			body: 'On ' + this.getRecallInitiationDate('MMM Do, YYYY') + ' ' + this.getFirmName() +
				' initiated recall of ' + this.getProductDescription() + ' due to ' + this.getReasonForRecall()
		});
	};
	RecallProvider.prototype.getCardType = function () {
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

	return RecallProvider;
});