define(['ejs', 'moment', 'URI'], function (ejs, moment, Uri, require) {
	var RecallSummaryProvider = function (recall) {
		this._recall = recall;
	};
	RecallSummaryProvider._symbolTpl = ejs.compile('<div class="summary-symbol <%=baseClass%> <%=levelClass%>">' +
		'<span class="symbol-type"><%=type%></span>' +
		'<h1 class="symbol"><%=symbol%></h1>' +
		'<span class="symbol-description"><%=description%></span>' +
		'</div>');
	RecallSummaryProvider.prototype.getFirmAddress = function () {
		return this._recall.city + ', ' + this._recall.state + ', ' + this._recall.country;
	};
	RecallSummaryProvider.prototype.getFirmName = function () {
		return this._recall.recalling_firm;
	};
	RecallSummaryProvider.prototype.getRecallId = function () {
		return this._recall.id;
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
		return '/details/' + this._recall.id;
	};
	RecallSummaryProvider.prototype.getShareTitle = function () {
		return this._recall.product_description;
	};
	RecallSummaryProvider.prototype.getShareLink = function () {
		return Uri(window.location.href).authority() + '/details/' + Uri.encode(this._recall.id);
	};
	RecallSummaryProvider.prototype.getFacebookShareLink = function () {
		return ejs.render('http://www.facebook.com/sharer/sharer.php?u=<%=url%>&title=<%=title%>', {
			url: this.getShareLink(),
			title: Uri.encode(this.getShareTitle())
		});
	};
	RecallSummaryProvider.prototype.getEmailShareLink = function () {
		return Uri('mailto:?').query({
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