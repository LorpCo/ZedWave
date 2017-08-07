// BASE SETUP
// =============================================================================

// call the packages we need
let express = require('express')        // call express
let app = express()                 // define our app using express
let bodyParser = require('body-parser')
let swagger = require('swagger-node-express').createNew(app)


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('dist'))

require('../routes/index')(app)

swagger.setApiInfo({
  title: 'example API',
  description: 'API to do something, manage something...',
  termsOfServiceUrl: '',
  contact: 'yourname@something.com',
  license: '',
  licenseUrl: '',
  basePath: '/',
})

swagger.configureSwaggerPaths('', 'api-docs', '')


app.listen(3000, function() {
  console.log('ZedWave Server listening on port 3000')
})
