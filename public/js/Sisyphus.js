define(['jquery', 'underscore'], function ($, _, require) {
    var Sisyphus = function (element, options) {
        var self = this;

        self._element = element;

        self._options = $.extend({}, Sisyphus.DEFAULT_OPTIONS, options || {});
    };
    Sisyphus.DEFAULT_OPTIONS = {
        triggerSelector: '',
        autoTrigger: true,
        onTrigger: $.noop,
        onRender: $.noop
    };
    Sisyphus.prototype._bind = function () {

    };

    return Sisyphus;
});