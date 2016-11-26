var express = require('express');

module.exports = function(app){
'use strict';

// get an instance of the express Router
var router = express.Router();


// ROUTES FOR OUR API
// =============================================================================
// Require the entry point to our routes
// more routes for our API will happen inside "nodeRoutes"

require('./nodeRoutes')(router);

app.use('/', router);


};