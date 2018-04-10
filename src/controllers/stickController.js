
import * as nodeServer from '../lib/zwaveServer'

function include(req, res, next) {
  nodeServer.zwave.addNode()
  console.log('adding')
  res.send(200)
}

// Put the controller into exclusion mode
function remove(req, res, next) {
  nodeServer.zwave.removeNode()
  console.log('removing')
  res.send(200)
}

// Manually remove a dead node
function removeDead(req, res, next) {
  nodeServer.zwave.removeFailedNode(req.params.id)
  console.log('removing')
  res.send(200)
}

export default { include, remove, removeDead }
