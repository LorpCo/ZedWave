'use strict'

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/nodes')
mongoose.Promise = global.Promise

let db = mongoose.connection


const schema = mongoose.Schema({
  nodeid: String,
  name: String,
  manufacturer: String,
  manufacturerid: String,
  product: String,
  producttype: String,
  productid: String,
  type: String,
  loc: String,
  classes: {},
  lorpState: {},
  ready: Boolean,
})

const ZedNode = db.model('ZedNode', schema)

export default ZedNode
