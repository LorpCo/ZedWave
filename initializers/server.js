// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var argv       = require('minimist')(process.argv.slice(2));
var mongoose   = require('mongoose');
var swagger    = require('swagger-node-express').createNew(app);

mongoose.connect('mongodb://localhost:27017/nodes')

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));



require('../routes/index')(app);

swagger.setApiInfo({
  title: "example API",
  description: "API to do something, manage something...",
  termsOfServiceUrl: "",
  contact: "yourname@something.com",
  license: "",
  licenseUrl: "",
  basePath: "/"
});

swagger.configureSwaggerPaths('', 'api-docs', '');


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
