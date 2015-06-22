'use strict';

function FoodCounts(apiData) {
	if (!(this instanceof FoodCounts)) {
		// Guard against calls without the new operator.
		return new FoodCounts(apiData);
	}

	var _total = apiData.total,
		_counts = apiData.counts;

	Object.defineProperties(this, {
		total: {
			get: function() { return _total; }
		},
		counts: {
			get: function() { return _counts; }
		}
	});
}

FoodCounts.prototype.toResponse = function toResponse() {
	return {
		total: this.total,
		counts: this.counts
	};
};

module.exports = FoodCounts;
