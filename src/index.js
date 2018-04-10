// BASE SETUP
// =============================================================================

// call the packages we need
import express from 'express'
import bodyParser from 'body-parser'
import router from './index.routes'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ 'extended': true }))
app.use(express('dist'))
app.use(morgan('dev'))
app.use(cors())


mongoose.connect('mongodb://localhost:27017/nodes')
mongoose.Promise = global.Promise

app.use('/api', router)


app.listen(3002, () => {
	console.log('ZedWave Server listening on port 3002')
})
