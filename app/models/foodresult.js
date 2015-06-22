'use strict';

function FoodResult(apiData) {
	if (!(this instanceof FoodResult)) {
		// Guard against calls without the new operator.
		return new FoodResult(apiData);
	}

	var _skip = apiData.meta.results.skip,
		_limit = apiData.meta.results.limit,
		_total = apiData.meta.results.total,
		_data = apiData.results;

	Object.defineProperties(this, {
		skip: {
			get: function() { return _skip; }
		},
		limit: {
			get: function() { return _limit; }
		},
		total: {
			get: function() { return _total; }
		},
		data: {
			get: function() { return _data; }
		}
	});
}

FoodResult.prototype.toResponse = function toResponse() {
	return {
		skip: this.skip,
		limit: this.limit,
		total: this.total,
		data: this.data
	};
};

module.exports = FoodResult;
