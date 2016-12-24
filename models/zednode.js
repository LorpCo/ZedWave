'use strict';

const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/nodes');
const schema = mongoose.Schema({
  nodeid: String,
  name: String,
  manufacturer: String,
  manufacturerid: String,
  product: String,
  producttype: String,
  productid: String,
  type: String,
  name: String,
  loc: String,
  classes: Object,
  ready: Boolean,
});

const ZedNode = db.model('ZedNode', schema);
module.exports = ZedNode;
