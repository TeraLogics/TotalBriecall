var path = require('path');

// Set the project's root directory
global.__basedir = path.join(__dirname, '..', '..');
global.__appdir = path.join(global.__basedir, 'app');

// MVC directory structure
global.__routedir = path.join(global.__appdir, 'routes');
global.__modelsdir = path.join(global.__appdir, 'models');
global.__viewsdir = path.join(global.__appdir, 'views');
global.__ctrldir = path.join(global.__appdir, 'controllers');

// Application helpers
global.__libdir = path.join(global.__appdir, 'lib');
global.__adptsdir = path.join(global.__appdir, 'adapters');
global.__dalsdir = path.join(global.__appdir, 'dals');

// Load application configuration
global.config = require(path.join(global.__appdir, 'config'));
