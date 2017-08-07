import nodeHandler from './nodeHandler'
import ZWave from 'openzwave-shared'
import ZedNode from '../models/zednode'


	export const zwave = new ZWave({
		ConsoleOutput: false,
		SaveConfiguration: true,
	})



  // Driver ready event
	zwave.on('driver ready', function(homeid) {
    console.log('scanning homeid=0x%s...', homeid.toString(16))
	})

	// Driver failed event
	zwave.on('driver failed', function() {
    console.log('failed to start driver')
    zwave.disconnect()
    process.exit()
	})

	// Event when a node is added
	zwave.on('node added', function(nodeid) {
		console.log('=================== NODE ADDED! ====================')
    ZedNode.findOne({'nodeid': nodeid}, function(err, node) {
      console.log('Adding Node: ' + nodeid)

      if (node){
        console.log(node._id)
      } else {
        let newnode = new ZedNode()
        newnode.nodeid = nodeid
        newnode.ready = false
        newnode.save(function(err) {
          if (err) {
            console.log('error saving node')
          } else {
            console.log('save a node')

          }
        })
      }

      if (err) {
        console.log(err)
      }
    })
  })


	zwave.on('node removed', function(nodeid) {
    ZedNode.remove({nodeid: nodeid}, function(err) {
			console.log('removing node from db')
      if (err) return console.log(err)
    })
		console.log('node '+nodeid+' removed')
	})

	// Node Event
	zwave.on('node event', function(nodeid, data) {
    console.log('node: %d event: Basic set %d', nodeid, data)
	})

	// Value added event
	zwave.on('value added', function(nodeid, comclass, value) {
		let targetComclass = comclass
		let targetValue = value
    ZedNode.findOne({'nodeid': nodeid}, function(err, node) {
			if (node) {
				// If the node classes are empty build a new one. Else use the db.

        let classes = {}
				let state = {}
        if (node.classes != null) {
          classes = node.classes
        }

				if (node.lorpState != null){
					state = node.lorpState
				} else {
					state = {}
				}
				// If the target class is empty build a new one
				if (classes[targetComclass] == null) {
					classes[targetComclass] = {}
				}
        console.log('updating classes!')
        console.log(node._id)
				// Insert a new class entry and value or update the old one.
				classes[targetComclass][targetValue.index] = targetValue
				node.classes = classes
				node.lorpState = state
				node.markModified('classes')
				node.markModified('lorpState')
				node.save(function(err) {
          if (err) {
						console.log('error updating node')
					}
				})

				let event = {}

				event.node_id = nodeid
				event.node_db_id = node._id
				event.manufacturer_id = node.manufacturerid
				event.product_id = node.productid
				event.product_type = node.producttype
				event.class_id = comclass
				event.value_index = value.index
				event.units = value["units"]
				event.value_label = value["label"]
				event.value = value["value"]

				nodeHandler(event, node)
			}
		})
	})

  // Value change event
	zwave.on('value changed', function(nodeid, comclass, value) {

		ZedNode.findOne({'nodeid': nodeid}, function(err, node) {
      if (node) {
        // if we have a node
        //  console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass
        //  value['label'],
        //			node.classes[comclass][value.index]['value'],
        //				value['value'])
        // If the node classes are empty build a new one. Else use the db.
				let targetComclass = comclass
				let targetValue = value

				let state = {}
				let classes = {}
				if (node.classes != null) {
					classes = node.classes
				}

				if (node.lorpState != null){
					state = node.lorpState
				} else {
					state = {}
				}
				// If the target class is empty build a new one
				if (classes[targetComclass] == null) {
					classes[targetComclass] = {}
				}
				console.log('updating classes!')
				console.log(node._id)
				// Insert a new class entry and value or update the old one.
				classes[targetComclass][targetValue.index] = targetValue
				node.classes = classes
				node.lorpState = state
				node.markModified('classes')
				node.markModified('state')
				node.save(function(err) {
					if (err) {
						console.log('error updating node')
					}
				})

				let event = {}

				event.node_id = nodeid
				event.node_db_id = node._id
				event.manufacturer_id = node.manufacturerid
				event.product_id = node.productid
				event.product_type = node.producttype
				event.class_id = comclass
				event.value_index = value.index
				event.units = value["units"]
				event.value_label = value["label"]
				event.value = value["value"]


				console.log('---EVENT INFO START---')
				console.log('DB ID: '+ event.node_db_id)
				console.log('ZW ID: '+ event.node_id)
				console.log('ManufacturerID: '+ event.manufacturer_id)
				console.log('ProductID: '+ event.product_id)
				console.log('Product Type: '+ event.product_type)
				console.log('Class: ' + event.class_id)
				console.log( event.value_label + ': ' + event.value + ' ' + event.units)
				console.log('Index: ' + event.value_index)
				console.log('---EVENT INFO END---')

				nodeHandler(event, node)
      }
    })
	})

	zwave.on('value removed', function(nodeid, comclass, index) {
    // Value removed
	})
	// Event when a node is ready
	zwave.on('node ready', function(nodeid, nodeinfo) {
    ZedNode.findOne({'nodeid': nodeid}, function(err, node) {
      if (node) {
        node.manufacturer = nodeinfo.manufacturer
        node.manufacturerid = nodeinfo.manufacturerid
        node.product = nodeinfo.product
        node.producttype = nodeinfo.producttype
        node.productid = nodeinfo.productid
        node.type = nodeinfo.type
        node.name = nodeinfo.name
        node.loc = nodeinfo.loc
        node.ready = true
        node.save(function(err) {
          if (err) {
            console.log('error saving node')
          }
          console.log('node saved and ready')
          })

        if (node.classes) {
          for (let comclass in node.classes) {
            if (comclass) {
							if (comclass == 37) {
									console.log('Enable Poll polling on switch: '+nodeid)
									//zwave.enablePoll({ node_id: nodeid, class_id: 37, instance:1, index:0}, 1)
									zwave.disablePoll({ node_id: nodeid, class_id: 37, instance:1, index:0})

							}
            }

          let values = node.classes[comclass]
          console.log('node %d: class %d', nodeid, comclass)
          for (let idx in values)
            if (idx) {
              console.log(
                'node%d:   %s=%s',
                nodeid,
                values[idx]['label'],
                values[idx]['value'])
            }
          }
        }
      }
		})
	})


	zwave.on('notification', function(nodeid, notif) {
    switch (notif) {
    case 0:
        console.log('node %d: message complete', nodeid)
        break
    case 1:
        console.log('node %d: timeout', nodeid)
        break
    case 2:
        console.log('node %d: nop', nodeid)
        break
    case 3:
        console.log('node %d: node awake', nodeid)
        break
    case 4:
        console.log('node %d: node sleep', nodeid)
        break
    case 5:
        console.log('node %d: node dead', nodeid)
        break
    case 6:
        console.log('node %d: node alive', nodeid)
        break
        }
	})

	zwave.on('scan complete', function() {
    console.log('====> scan complete, hit ^C to finish.')
    // set dimmer node 5 to 50%
    // zwave.setValue(5,38,1,0,50)
    // Add a new device to the ZWave controller
    if (zwave.hasOwnProperty('beginControllerCommand')) {
      // using legacy mode (OpenZWave version < 1.3) - no security
    } else {
      // using new security API
      // set this to 'true' for secure devices eg. door locks
    }
	})

	zwave.on('controller command', function(n, rv, st, msg) {
    console.log('controller commmand feedback: %s node==%d, retval=%d,state=%d',
    msg, n, rv, st)
	})


	zwave.connect('/dev/ttyACM0')

	process.on('SIGINT', function() {
    console.log('disconnecting...')
    zwave.disconnect('/dev/ttyUSB0')
    process.exit()
	})
