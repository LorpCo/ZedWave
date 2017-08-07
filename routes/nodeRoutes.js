'use strict'

import * as nodeServer from '../lib/zwaveServer'


import ZedNode from '../models/zednode'

module.exports = function(router) {
  // GET root path to fetch all nodes
  router.route('/')
    .get(function(req, res) {
       res.sendFile(__dirname + '/dist/index.html')
     })


  router.route('/api/nodes')
		.get(function(req, res, next) {
      ZedNode.find(function(err, nodes) {
           if (err)
               res.send(err)

           res.json(nodes)
       })
		})
    // GET fetch a single node
  router.route('/api/nodes/:nodeid')
		.get(function(req, res, next) {
      ZedNode.findById(req.params.nodeid, function(err, node) {
        if (err)
          res.send(err)
        res.json(node)
      })
		})

    .delete(function(req, res) {
      ZedNode.remove({
        _id: req.params.nodeid,
      }, function(err, node) {
        if (err)
        res.send(err)
        res.json({message: 'Deleted Node'})
      })
    })

	// GET Node Classes
	router.route('/api/nodes/:nodeid/classes')
		.get(function(req, res, next) {
      ZedNode.findById(req.params.nodeid, function(err, node) {
        if (err)
        res.send(err)
        res.json(node.classes)
      })
		})

	// GET Node Configuration
	router.route('/api/nodes/:nodeid/configuration')
		.post(function(req, res, next) {
      nodeServer.zwave.requestAllConfigParams(parseInt(req.params.nodeid))
      console.log("DUMPCONFIG")
      console.log("########################################################")
      res.send(200)
		})


  router.route('/api/nodes/:nodeid/configValue/:valueId')
		.post(function(req, res, next) {
      nodeServer.zwave.requestConfigParam(parseInt(req.params.nodeid), parseInt(req.params.valueId))
      console.log("DUMPCONFIG")
      console.log("########################################################")
      res.send(200)
		})

  router.route('/api/nodes/:nodeid/send-command/:command')
    .post(function(req, res, next) {
      ZedNode.findById(req.params.nodeid, function(err, node) {
        if (err){
          res.send(err)
        } else {
          console.log('command received')
          console.log(req.params.command)

          if (req.params.command == "on"){
            nodeServer.zwave.setValue(
                    node.nodeid,
                    37,
                    1,
                    0,
                    true)
                    console.log('turning on')
          }

          if (req.params.command == "off"){
            nodeServer.zwave.setValue(
                    node.nodeid,
                    37,
                    1,
                    0,
                    false)
                    console.log('turning off')
          }
          res.send(200)
        }
      })
    })
	//POST to change a class parameter
	router.route('/api/nodes/write-value/:nodeid/:commandClass/:instance/:index/:value')
		.post(function(req, res, next) {
			if(req.params.value == 'true') {
				nodeServer.zwave.setValue(
          req.params.nodeid,
          parseInt(req.params.commandClass),
          parseInt(req.params.instance),
          parseInt(req.params.index), true)
          console.log('turning on')
			}
			if(req.params.value == 'false') {
				nodeServer.zwave.setValue(req.params.nodeid,
        parseInt(req.params.commandClass),
        parseInt(req.params.instance),
        parseInt(req.params.index), false)
				console.log('turning off')
			}
      if(req.params.value == isNaN && req.params.value != true &&
        req.params.value != false) {
				nodeServer.zwave.setValue(req.params.nodeid,
          parseInt(req.params.commandClass),
          parseInt(req.params.instance),
          parseInt(req.params.index),
          req.params.value)
          console.log('sending unknown command DANGER!!')
			} else {
				nodeServer.zwave.setValue(req.params.nodeid,
          parseInt(req.params.commandClass),
          parseInt(req.params.instance),
          parseInt(req.params.index),
          parseInt(req.params.value))
				console.log('sending unknown number: '+req.params.value+' command DANGER!!')
			}
			console.log('sending command')
			res.send(200)
		})

  router.route('/api/nodes/:nodeid/setConfig/:paramId/:paramValue/:paramSize')
    .post(function(req, res, next) {
      console.log("setting configiruation params " + req.params.paramValue)
			nodeServer.zwave.setConfigParam(parseInt(req.params.nodeid),
                                      parseInt(req.params.paramId),
                                      parseInt(req.params.paramValue),
                                      parseInt(req.params.paramSize))
			res.send(200)
		})

  router.route('/api/nodes/:nodeid/requestConfig')
    .post(function(req, res, next){
      console.log("REQUESTING CONFIG PARAMS")
      nodeServer.zwave.requestAllConfigParams(parseInt(req.params.nodeid)
      )
      res.send(200)
    })


    // POST to add a node
    router.route('/api/commands/add')
      .post(function(req, res, next) {
        nodeServer.zwave.addNode()
        console.log('adding')
        res.send(200)
      })
    // POST to remove a node
    router.route('/api/commands/remove')
      .post(function(req, res, next) {
        nodeServer.zwave.removeNode()
        console.log('removing')
        res.send(200)
      })

    router.route('/api/commands/removedead/:id')
      .post(function(req, res, next) {
        nodeServer.zwave.removeFailedNode(req.params.id)
        console.log('removing')
        res.send(200)
      })
}
