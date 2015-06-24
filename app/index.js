'use strict';

require('newrelic');

var _ = require('underscore'),
	bodyParser = require('body-parser'),
	colors = require('colors'),
	compression = require('compression'),
	consolidate = require('consolidate'),
	cookieParser = require('cookie-parser'),
	errorHandler = require('errorhandler'),
	express = require('express'),
	expressValidator = require('express-validator'),
	favicon = require('serve-favicon'),
	fs = require('fs'),
	methodOverride = require('method-override'),
	moment = require('moment'),
	mongoose = require('mongoose'),
	path = require('path'),
	Promise = require('bluebird'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session);

require('moment-duration-format');

process.on('uncaughtException', function (err) {
	console.error('uncaughtException: ', err.message);
	console.error(err.stack);
	process.exit(1);
});

// Set the project's root directory
global.__appdir = __dirname;
global.__basedir = path.join(__dirname, '..');
global.__libdir = path.join(global.__basedir, 'lib');
global.__assetsdir = path.join(global.__basedir, 'public');

// MVC directory structure
global.__modelsdir = path.join(global.__appdir, 'models');
global.__viewsdir = path.join(global.__appdir, 'views');
global.__ctrldir = path.join(global.__appdir, 'controllers');

global.__adptsdir = path.join(global.__appdir, 'adapters');

// Load application configuration
global.config = require(path.join(global.__basedir, 'conf', 'config'));

var app = express(),
	readDir = Promise.promisify(fs.readdir);

// Mongo & Mongoose Configuration
mongoose.set('debug', process.env.NODE_ENV === 'development');
mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('port', (global.config.PORT));
app.set('showStackError', true);

// Should be placed before express.static to ensure that all assets and data are compressed (utilize bandwidth)
app.use(compression({
	level: 9 // Levels are specified in a range of 0 to 9, where-as 0 is no compression and 9 is best compression, but slowest
}));

app.locals._ = _; // use underscore in views
app.locals.moment = moment; // use moment in views
app.enable('trust proxy');

// assign the template engine to .ejs files
app.engine('ejs', consolidate.ejs);
// also allow straight html; use the EJS renderer
app.engine('html', consolidate.ejs);

// set .ejs as the default extension
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', global.__viewsdir);

app.use(express.static(global.__assetsdir));

app.use('/docs/api', express.static(path.join(global.__viewsdir, 'docs', 'api')));

// Set the favicon
var faviconPath = path.join(global.__assetsdir, 'img', 'favicon.ico');
if (fs.exists(faviconPath)) {
	app.use(favicon(faviconPath));
}

// The cookieParser should be above session
app.use(cookieParser(global.config.SECRET));

// Request body parsing middleware should be above methodOverride
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(methodOverride());
app.use(function (req, res, next) {
	req.remoteAddress = req.hostname || req.ip;
	return next();
});

// Express/Mongo session storage
app.use(session({
	proxy: true,
	secret: global.config.SECRET,
	cookie: {
		maxAge: global.config.SESSIONLENGTH
	},
	store: new mongoStore({
		url: global.config.MONGOLAB_URI
	}),
	resave: true,
	saveUninitialized: true
}));

app.use(function (req, res, next) {
	if (!req.session.hasOwnProperty('preferences')) {
		req.session.preferences = {};
	}
	res.locals.session = req.session;
	return next();
});

app.use(function (req, res, next) {
	console.log('IP: '.yellow + colors.grey(req.headers['x-forwarded-for'] || req.connection.remoteAddress));
	console.log('Url: '.yellow + colors.green(req.method) + ' ' + colors.grey(req.url));

	if (req.headers && !_.isEmpty(req.headers)) {
		console.log('Headers: '.yellow + '%j'.grey, req.headers);
	}
	if (req.params && !_.isEmpty(req.params)) {
		console.log('Params: '.yellow + '%j'.grey, req.params);
	}
	if (req.body && !_.isEmpty(_.object(req.body))) {
		console.log('Body: '.yellow + '%j'.grey, req.body);
	}
	return next();
});

readDir(path.join(global.__appdir, 'routes')).then(function (routes) {
	// load each resource
	routes.sort();

	routes.forEach(function (route) {
		if (path.extname(route) === '.js') {
			route = route.slice(0, route.length - 3); // Remove extension
			require(path.join(global.__appdir, 'routes', route))(app); // Include the route file
		} else {
			console.warn('Skipped loading route: ' + route + ' because it is not a route file');
		}
	});

	// Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function (err, req, res, next) {
		if (err.message.indexOf('not found') !== -1) { // Treat as 404
			return next();
		} else {
			console.error(err.stack);
			return res.status(500).render('500', {
				error: err.stack
			});
		}
	});

	app.use(function (req, res) { // Assume 404 since no middleware responded
		return res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
	});

	if (global.config.NODE_ENV === 'development') { // Error handler - has to be last
		app.use(errorHandler());
	}

	app.listen(app.get('port'), function () {
		_.each(app._router.stack, function (r) {
			if (r.route) {
				_.each(_.keys(r.route.methods), function (method) {
					console.log('%s\t%s', method.toUpperCase(), r.route.path);
				});
			}
		});

		console.log('Node app is running on port', app.get('port'));
	});
}).catch(function (err) {
	console.error(err);
	throw err;
}).done();