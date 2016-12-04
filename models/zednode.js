
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ZedNodeSchema = new Schema({
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
  ready: Boolean
});


module.exports = mongoose.model('ZedNode', ZedNodeSchema);
