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
		return this._recall.recall_number;
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
		return '/details/' + this._recall.recall_number;
	};
	RecallSummaryProvider.prototype.getFacebookShareLink = function () {
		return ejs.render('http://www.facebook.com/sharer/sharer.php?u=<%=url%>&title=<%=title%>', {
			url: Uri(window.location.href).authority() + '/details/' + Uri.encode(this._recall.recall_number),
			title: Uri.encode(this._recall.product_description)
		});
	};
	RecallSummaryProvider.prototype.getClassSymbol = function () {
		var level = new Array(this._recall.classificationlevel + 1).join('i'),
			symbol = level,
			description = ['dangerous', 'moderate', 'notification'][this._recall.classificationlevel - 1];

		return RecallSummaryProvider._symbolTpl({
			type: 'class',
			baseClass: 'recall-class-text',
			levelClass: 'recall-class-' + level,
			symbol: symbol,
			description: description
		});
	};
	RecallSummaryProvider.prototype.getStatusSymbol = function () {
		var status = null;

		switch (this._recall.status) {
			case 'Ongoing':
				status = {
					type: 'status',
					baseClass: 'recall-status-text',
					levelClass: 'recall-status-ongoing',
					symbol: 'o',
					description: 'on-going'
				};
				break;
			case 'Pending':
				status = {
					type: 'status',
					baseClass: 'recall-status-text',
					levelClass: 'recall-status-Pending',
					symbol: 'p',
					description: 'pending'
				};
				break;
			case 'Completed':
				status = {
					type: 'status',
					baseClass: 'recall-status-text',
					levelClass: 'recall-status-completed',
					symbol: 'c',
					description: 'completed'
				};
				break;
			case 'Terminated':
				status = {
					type: 'status',
					baseClass: 'recall-status-text',
					levelClass: 'recall-status-terminated',
					symbol: 't',
					description: 'terminated'
				};
				break;
		}

		return RecallSummaryProvider._symbolTpl(status);
	};
	RecallSummaryProvider.prototype.getActionSymbol = function () {
		return RecallSummaryProvider._symbolTpl({
			type: 'action',
			baseClass: 'recall-action-text',
			levelClass: 'recall-action-' + (this._recall.mandated ? 'mandated' : 'voluntary'),
			symbol: (this._recall.mandated ? 'MA' : 'FI'),
			description: (this._recall.mandated ? 'mandated' : 'voluntary')
		});
	};

	return RecallSummaryProvider;
});