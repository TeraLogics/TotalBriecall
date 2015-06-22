var path = require('path');

global.__basedir = path.join(__dirname, '..', '..');
global.__appdir = path.join(global.__basedir, 'app');

global.__routedir = path.join(global.__appdir, 'routes');
global.__ctrldir = path.join(global.__appdir, 'controllers');
global.__modelsdir = path.join(global.__appdir, 'models');
global.__adptsdir = path.join(global.__appdir, 'adapters');

global.__libdir = path.join(global.__basedir, 'lib');
