// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nodes')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



require('../routes/index')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
