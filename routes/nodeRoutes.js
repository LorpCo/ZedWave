
nodeServer = require('../lib/zwaveServer');

module.exports = function(router) {
 'use strict';
 	
 	// GET root path to fetch all nodes

 	router.route('/api/nodes')
		.get(function(req, res, next) {
			res.json(nodeServer.nodes);
		});	
    // GET fetch a single node
 	router.route('/api/nodes/:nodeid')
		.get(function(req, res, next) {
			res.json(nodeServer.nodes[req.params.nodeid])
		});
	// GET Node Classes
	router.route('/api/nodes/:nodeid/classes')
		.get(function(req,res,next){
			res.json(nodeServer.nodes[req.params.nodeid]["classes"])
		});

	// GET Node Configuration
	router.route('/api/nodes/:nodeid/configuration')
		.post(function(req,res,next){
			nodeServer.connection.requestAllConfigParams(req.params.nodeid);
			console.log('refreshing node info');
			res.send(200);
		});		
	// POST to add a node 
	router.route('/api/nodes/add')
		.post(function(req, res, next) {
			nodeServer.connection.addNode();
			console.log('adding');
			res.send(200);
		});
	// POST to remove a node
	router.route('/api/nodes/remove')
		.post(function(req, res, next) {
			nodeServer.connection.removeNode();
			console.log('removing');
			res.send(200);
		});
	// POST to change a class parameter 
	router.route('/api/nodes/:nodeid/sendCommand/:commandClass/:instance/:index/:value')
		.post(function(req,res,next) {
			if(req.params.value == "true"){
				nodeServer.connection.setValue(req.params.nodeid,  parseInt(req.params.commandClass),  parseInt(req.params.instance),  parseInt(req.params.index), true);
				console.log('turning on')
			}
			else if(req.params.value == "false"){
				nodeServer.connection.setValue(req.params.nodeid,  parseInt(req.params.commandClass),  parseInt(req.params.instance),  parseInt(req.params.index), false);
				console.log('turning off')
			
			}
			else if(req.params.value == NaN && req.params.value != true && req.params.value != false){
				nodeServer.connection.setValue(req.params.nodeid,  parseInt(req.params.commandClass),  parseInt(req.params.instance),  parseInt(req.params.index), req.params.value);
				console.log('sending unknown command DANGER!!')
			}
			else {
				nodeServer.connection.setValue(req.params.nodeid,  parseInt(req.params.commandClass),  parseInt(req.params.instance),  parseInt(req.params.index), parseInt(req.params.value));
				console.log('sending unknown command DANGER!!')
			}



			
			console.log('sending command')
			res.send(200)
		});

	router.route('/api/nodes/:nodeid/setConfig/:paramId/:paramValue/:size')
		.post(function(req,res,next) {
			nodeServer.connection.setConfigParam(parseInt(req.params.nodeId), parseInt(req.params.paramId), parseInt(req.params.paramValue), parseInt(req.params.size));
			res.send(200)
		});
		
};