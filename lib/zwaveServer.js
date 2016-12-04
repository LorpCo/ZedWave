
	var ZWave = require('openzwave-shared');
	var eventHandler = require('./eventHandler');
	// Build the zwave object


	var zwave = new ZWave({
		ConsoleOutput: false,
		SaveConfiguration: true
	});

	var ZedNode = require('../models/zednode');
	var nodes = require('./nodelist');


	var zwaveServer = {
		connection: zwave
	};

  // Driver ready event
	zwave.on('driver ready', function(homeid) {
	    console.log('scanning homeid=0x%s...', homeid.toString(16));
	});

	// Driver failed event
	zwave.on('driver failed', function() {
	    console.log('failed to start driver');
	    zwave.disconnect();
	    process.exit();
	});

	// Event when a node is added
	zwave.on('node added', function(nodeid) {
		console.log('=================== NODE ADDED! ====================');

		ZedNode.findOne({'nodeid': nodeid}, function(err, node){
			if (node == null ){
				newnode = new ZedNode();
				newnode.nodeid = nodeid;
				newnode.ready = false;
				newnode.save(function(err) {
					if (err){
						console.log('error saving node');
					}
					console.log('node added')

					});
	    	};
		});
	});

	// Node removed event
	zwave.on('node removed', function(nodeid){
		delete nodes["zed"+nodeid]
		console.log('node '+nodeid+'removed')
	});

	// Node Event
	zwave.on('node event', function(nodeid, data) {
		  console.log('node%d event: Basic set %d', nodeid, data);
	});

	// Value added event
	zwave.on('value added', function(nodeid, comclass, value) {
		var targetNodeid = nodeid;
		var targetComclass = comclass;
		var targetValue = value;
		ZedNode.findOne({'nodeid': nodeid}, function(err, node){
			if (node != null){

				// If the node classes are empty build a new one. Else use the db.
				if (node.classes == null) {
					classes = {}
				}else{
					classes = node.classes
				}

				// If the target class is empty build a new one
				if (classes[targetComclass] == null){
					classes[targetComclass] = {};
				}

				// Insert a new class entry and value or update the old one.
				classes[targetComclass][targetValue.index] = targetValue;
				node.classes = classes
				node.markModified('classes');
				node.save(function(err) {
				  if (err){
						console.log('error updating node');
					};
				});
			};
		});
	});

  // Value change event
	zwave.on('value changed', function(nodeid, comclass, value) {
	  var changedNodeid = nodeid
		var changedComclass = comclass
		var changedValue = value
		ZedNode.findOne({'nodeid': nodeid}, function(err, node){

		if (node.ready){
				 //console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass, value['label'],
				 //			node.classes[comclass][value.index]['value'],
				 //				value['value']);

				 // If the node classes are empty build a new one. Else use the db.
			 	 if (node.classes == null) {
					 classes = {}
				 }else{
					 classes = node.classes
				 }

				 // If the class entry is empty build  a new one.
				 if (classes[changedComclass] == null){
					 classes[changedComclass] = {};
			   }

				 // Insert a new class entry and value or update the old one.
				 classes[changedComclass][changedValue.index] = changedValue;
				 node.classes = classes
				 node.markModified('classes');
				 node.save(function(err){
					 if(err){
						 console.log('error saving node')
					 }
				 });

			}

						// Generic class 32. We need to inspect the device and see how to treat its data
 						// You can add other cases here.
 						// The case is made up of manufacturerid and productid
 						// Example: 0x00860x0078
				   	if(comclass == 32){
				       var entityType = node.manufacturerid + node.productid
				       console.log(entityType);

				       switch(entityType){
				        case "0x00860x0078":
				            //Aeotec Contact
				            switch(value["value"]){
				              case 255:
				                eventHandler(nodeid, comclass, "open", "", "contact");
				                console.log("sending open")
				                break;
				              case 0:
				                eventHandler(nodeid, comclass, "closed", "", "contact");
				                console.log("sending closed")
				                break;
				              default:
				                console.log("unknown")
				                break;
				            }
				          default:

				          console.log("unknown")
				          break;
				      }
				    }

						// Generic class 37. We need to inspect the device and see how to treat its data
						// Typically Binary Switch.

				    if(comclass == 37){
				   		eventHandler(nodeid, comclass, value["value"], "", "switch");
				   	}

						// Generic class 48. We need to inspect the device and see how to treat its data
						// Typically multi sensor values.
				   	if(comclass == 48){


				      if(node.manufacturerid != null){
				      var entityType = node.manufacturerid + node.productid
				       console.log(entityType);

				       switch(entityType){
				        case "0x010f0x2001":
				          //FIBARO Motion
				          eventHandler(nodeid, comclass, value["value"], "", "motion");
				           console.log("sending fibaro motion");
				          break;
				        case "0x00860x0064":
				          //AEOTEC GEN 6 Multi
				          eventHandler(nodeid, comclass, value["value"], "", "motion");
				          console.log("sending aeotec gen 6 motion");
				          break;
				        case "0x00860x0005":
				          //AEOTEC GEN 5 Multi
				          eventHandler(nodeid, comclass, value["value"], "", "motion");
				          console.log("sending aeotec gen 5 motion");
				          break;
				        case "0x014a0x0002":
				            //Ecolink Contact - Good for now 11/21/2016
				            switch(value["value"]){
				              case true:
				                eventHandler(nodeid, comclass, "open", "", "contact");
				                console.log("sending open")
				                break;
				              case false:
				                eventHandler(nodeid, comclass, "closed", "", "contact");
				                console.log("sending closed")
				              default:
				                console.log("untermined state")
				                break;
				            }
				         break;
				        case "0x00860x0078":
				            //Aeotec Contact
				            switch(value["value"]){
				              case true:
				                eventHandler(nodeid, comclass, "open", "", "contact");
				                console.log("inverting and sending false")
				                break;
				              case false:
				                eventHandler(nodeid, comclass, "closed", "", "contact");
				                console.log("inverting and sending true")
				              default:
				                console.log("untermined state")
				                break;
				            }
				         break;
				        case "0x014a0x0001":
				          //Ecolink Motion
				          eventHandler(nodeid, comclass, value["value"], "", "motion");
				          console.log("sending ecolink motion");
				          break;
				        default:
				          console.log("not enought info. Skipping")
				          break;
				       }
				      }

				   	}


				   	if(comclass == 49){
				      var entityType = node.manufacturerid + node.productid
				      console.log(entityType);

				      switch(entityType){
				        case "0x00860x0005":

				          if(value.index == 1){
				            if (value["value"] < 1){
				              var temp = value["value"] * 1000000 + 32
				              eventHandler(nodeid, comclass, temp, "F", "temperature");
				            }

				          }
				          if(value.index == 3){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "luminance");
				          }
				          if(value.index == 5){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "relativeHumidity");
				          }
				          if(value.index == 27){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "ultraviolet");
				          }
				          break;
				        default:
				          if(value.index == 1){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "temperature");
				          }
				          if(value.index == 3){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "luminance");
				          }value["value"]
				          if(value.index == 5){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "relativeHumidity");
				          }
				          if(value.index == 27){
				            eventHandler(nodeid, comclass, value["value"], value["units"], "ultraviolet");
				          }
				          break;
				      }




				   	}

				    if(comclass == 128){
				        eventHandler(nodeid, comclass, value["value"], value["units"], "batteryLevel");
				    }

				    if(comclass == 115){
				      if (value.index == 0) {
				        eventHandler(nodeid, comclass, value["value"], value["units"], "powerLevel");
				      }

				    }

				});

	});

	zwave.on('value removed', function(nodeid, comclass, index) {
	    if (nodes["zed"+nodeid]['classes'][comclass] &&
	        nodes["zed"+nodeid]['classes'][comclass][index])
	        delete nodes["zed"+nodeid]['classes'][comclass][index];
	});

	// Event when a node is ready
	zwave.on('node ready', function(nodeid, nodeinfo) {
	  ZedNode.findOne({'nodeid':nodeid}, function(err, node){
			node.manufacturer = nodeinfo.manufacturer;
			node.manufacturerid = nodeinfo.manufacturerid;
			node.product = nodeinfo.product;
			node.producttype = nodeinfo.producttype;
			node.productid = nodeinfo.productid;
			node.type = nodeinfo.type;
			node.name = nodeinfo.name;
			node.loc = nodeinfo.loc;
			node.ready = true;
			node.save(function(err){
				if (err) {
					console.log('error saving node')
				}
				console.log('node saved and ready')
			})
			console.log('node%d: %s, %s', nodeid,
						nodeinfo.manufacturer ? nodeinfo.manufacturer
								: 'id=' + nodeinfo.manufacturerid,
						nodeinfo.product ? nodeinfo.product
								 : 'product=' + nodeinfo.productid +
									 ', type=' + nodeinfo.producttype);
			console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
						nodeinfo.name,
						nodeinfo.type,
						nodeinfo.loc);

				for (var comclass in node.classes) {
				switch (comclass) {
				case 0x25: // COMMAND_CLASS_SWITCH_BINARY
				case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
					zwave.enablePoll(nodeid, comclass);
					break;
				}
				var values = node.classes[comclass];
				console.log('node%d: class %d', nodeid, comclass);
				for (var idx in values)
					console.log('node%d:   %s=%s', nodeid, values[idx]['label'], values[idx]['value']);
			}
		});
	});


	zwave.on('notification', function(nodeid, notif) {
	    switch (notif) {
	    case 0:
	        console.log('node%d: message complete', nodeid);
	        break;
	    case 1:
	        console.log('node%d: timeout', nodeid);
	        break;
	    case 2:
	        console.log('node%d: nop', nodeid);
	        break;
	    case 3:
	        console.log('node%d: node awake', nodeid);
	        break;
	    case 4:
	        console.log('node%d: node sleep', nodeid);
	        break;
	    case 5:
	        console.log('node%d: node dead', nodeid);
	        break;
	    case 6:
	        console.log('node%d: node alive', nodeid);
	        break;
	        }
	});

	zwave.on('scan complete', function() {
	    console.log('====> scan complete, hit ^C to finish.');
	    // set dimmer node 5 to 50%
	    //zwave.setValue(5,38,1,0,50);
	    // Add a new device to the ZWave controller
	    if (zwave.hasOwnProperty('beginControllerCommand')) {
	      // using legacy mode (OpenZWave version < 1.3) - no security

	    } else {
	      // using new security API
	      // set this to 'true' for secure devices eg. door locks
	    }
	});

	zwave.on('controller command', function(n,rv,st,msg) {
	    console.log('controller commmand feedback: %s node==%d, retval=%d, state=%d',msg,n,rv,st);
	});


	zwave.connect('/dev/ttyACM0')

	process.on('SIGINT', function() {

	    console.log('disconnecting...');
	    zwave.disconnect('/dev/ttyUSB0');
	    process.exit();
	});



	module.exports = zwaveServer;
