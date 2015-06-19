'use strict';

var _ = require('underscore'),
	framework = require('uv-framework'),
	pg = framework.db.pg,
	https = require('https'),
	path = require('path');

global.config = require(path.join(__dirname, 'conf', 'config')).get();

var options = {
		host: 'api.fda.gov',
		port: 443,
		path: '/food/enforcement.json',
		method: 'GET'
	},
	limit = 100,
	offset = 0,
	year = 2008,
	maxYear = 2015;

function processRes(res) {
	console.log("statusCode: ", res.statusCode);
	if (res.statusCode !== 200) {
		setTimeout(callApi, 1000);
		return;
	}
	var data = '';
	res.on('data', function (d) {
		data += d;
	}).on('end', function () {
		var result = JSON.parse(data);
		//console.log(result);

		_.each(result.results, function (item) {
			//console.log(item);
			var sql = "INSERT INTO recalls VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)",
				params = [
					item.recall_number,
					item.reason_for_recall,
					item.status,
					item.distribution_pattern,
					item.product_quantity,
					item.recall_initiation_date,
					item.state,
					item.event_id,
					item.product_type,
					item.product_description,
					item.country,
					item.city,
					item.recalling_firm,
					item.report_date,
					item["@epoch"],
					item.voluntary_mandated,
					item.classification,
					item.code_info,
					item["@id"],
					item.openfda,
					item.initial_firm_notification
				];

			pg.singleQuery(global.config.connections.pg.buildConnectionString(), sql, params).catch(console.error).done();
		});

		offset += result.results.length;
		console.log(result.meta);

		if (offset < result.meta.results.total) {
			console.log('Running again...');
			setTimeout(callApi, 100);
		} else if (year < maxYear) {
			console.log('New year...');
			offset = 0;
			year++;
			setTimeout(callApi, 100);
		}
	});
}

function callApi() {
	var tempOpts = {
		host: options.host,
		port: options.port,
		path: options.path + '?search=recall_initiation_date:[' + year + '-01-01+TO+' + year + '-12-31]&' + 'skip=' + offset + "&limit=" + limit,
		method: options.method
	};
	console.log(tempOpts);
	var reqGet = https.request(tempOpts, processRes);
	reqGet.end();
	reqGet.on('error', console.error);
}

callApi();