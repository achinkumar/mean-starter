'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var config = require('./server/config/config');
var app = express();

/**
 * Main application file
 */
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./server/config/config');



// Passport Configuration
require('./server/config/passport')();

var app = express();

// Express settings
require('./server/config/express')(app);

// Routing
require('./server/routes')(app);

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;