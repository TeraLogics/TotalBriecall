'use strict';

describe('Routes', function () {

	var common = {
		endHandler: function (req, res) {
			res.end();
		}
	};

	require('./routes/api')(common);

});