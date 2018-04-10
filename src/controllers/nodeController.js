import ZedNode from '../models/zednode'
import * as nodeServer from '../lib/zwaveServer'

function list(req, res, next) {
  ZedNode.find((err, nodes) => {
    if (err) {
      res.send(err)
    }
    res.json(nodes)
  })
}

function show(req, res, next) {
  ZedNode.findById(req.params.nodeid, (err, node) => {
    if (err) {
      res.send(err)
      res.json(node)
    }
  })
}

function remove(req, res) {
  ZedNode.remove({
    _id: req.params.nodeid
  }, (err, node) => {
    if (err) {
      res.send(err)
      res.json({ message: 'Deleted Node' })
    }
  })
}

function getClasses(req, res, next) {
  ZedNode.findById(req.params.nodeid, (err, node) => {
    if (err) {
      res.send(err)
      res.json(node.classes)
    }
  })
}

function getConfig(req, res, next) {
  nodeServer.zwave.requestAllConfigParams(parseInt(req.params.nodeid))
  console.log('DUMPCONFIG')
  console.log('########################################################')
  res.sendStatus(200)
}

function getConfigValue(req, res, next) {
  nodeServer.zwave.requestConfigParam(parseInt(req.params.nodeid), parseInt(req.params.valueId))
  console.log('DUMPCONFIG')
  console.log('########################################################')
  res.send(200)
}

function sendCommand(req, res, next) {
  ZedNode.findById(req.params.nodeid, (err, node) => {
    if (err) {
      res.send(err)
    } else {
      console.log('command received')
      console.log(req.params.command)
      if (req.params.command === 'on') {
        nodeServer.zwave.setValue(node.nodeid, 37, 1, 0, true)
        console.log('turning on')
      }
      if (req.params.command === 'off') {
        nodeServer.zwave.setValue(node.nodeid, 37, 1, 0, false)
        console.log('turning off')
      }
      res.send(200)
    }
  })
}

function changeClassParam(req, res, next) {


  if (isNaN(req.params.value)) {
    nodeServer.zwave.setValue(
      parseInt(req.params.zedId),
      parseInt(req.params.commandClass),
      parseInt(req.params.instance),
      parseInt(req.params.index),
      req.params.value
    )
  } else {
    nodeServer.zwave.setValue(
      parseInt(req.params.zedId),
      parseInt(req.params.commandClass),
      parseInt(req.params.instance),
      parseInt(req.params.index),
      parseInt(req.params.value)
    )
  }

  nodeServer.zwave.writeConfig()
  console.log('sending command')
  res.send(200)


}

function setClassParamSize(req, res, next) {
  console.log(`setting configiruation params ${ req.params.paramValue }`)
  nodeServer.zwave.setConfigParam(parseInt(req.params.nodeid), parseInt(req.params.paramId), parseInt(req.params.paramValue), parseInt(req.params.paramSize))
  res.send(200)
}
export default { list, show, remove, getClasses, getConfig, getConfigValue, sendCommand, changeClassParam, setClassParamSize }
