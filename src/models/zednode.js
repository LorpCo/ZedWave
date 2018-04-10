import mongoose, { Schema } from "mongoose"

const schema = Schema({
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
  ready: Boolean,
})

const ZedNode = mongoose.model('ZedNode', schema)

export default ZedNode
