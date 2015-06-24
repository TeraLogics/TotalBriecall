/* globals
 fbappid
 */

define(['ejs', 'moment'], function (ejs, moment, require) {
	var CommentProvider = function (comment) {
			this._comment = comment;
		},
		_getBaseURL = function () {
			return window.location.origin ? window.location.origin : Uri(window.location.href).authority();
		};
	CommentProvider.prototype.getName = function () {
		return this._comment.name || 'User';
	};
	CommentProvider.prototype.getRecallNumber = function () {
		return this._comment.recall_number;
	};
	CommentProvider.prototype.getComment = function () {
		return this._comment.comment;
	};
	CommentProvider.prototype.getCreationDate = function (format) {
		return moment.unix(this._comment.created).format(format || 'MMMM Do, YYYY hh:mma');
	};
	CommentProvider.prototype.getLocation = function () {
		return this._comment.location || 'Unknown';
	};

	return CommentProvider;
});