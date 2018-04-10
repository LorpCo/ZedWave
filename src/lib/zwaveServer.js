import eventHandler from './eventHandler'
import ZWave from 'openzwave-shared'
import ZedNode from '../models/zednode'


export const zwave = new ZWave({
  'ConsoleOutput': false,
  'SaveConfiguration': true
})


// Driver ready event
zwave.on('driver ready', (homeid) => {
  console.log('scanning homeid=0x%s...', homeid.toString(16))
})

// Driver failed event
zwave.on('driver failed', () => {
  console.log('failed to start driver')
  zwave.disconnect()
  process.exit()
})

// Event when a node is added
zwave.on('node added', (nodeid) => {
  console.log('=================== NODE ADDED! ====================')
  ZedNode.findOne({ 'nodeid': nodeid }, (err, node) => {
    console.log(`Adding Node: ${ nodeid}`)

    if (node) {
      console.log(node._id)
    } else {
      let newnode = new ZedNode()

      newnode.nodeid = nodeid
      newnode.ready = false
      newnode.save((err) => {
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


zwave.on('node removed', (nodeid) => {
  ZedNode.remove({ 'nodeid': nodeid }, (err) => {
    console.log('removing node from db')
    if (err) {
      return console.log(err)
    }
  })
  console.log(`node ${ nodeid } removed`)
})

// Node Event
zwave.on('node event', (nodeid, data) => {
  console.log('node: %d event: Basic set %d', nodeid, data)
})

// Value added event
zwave.on('value added', (nodeid, comclass, value) => {
  let targetComclass = comclass
  let targetValue = value

  ZedNode.findOne({ 'nodeid': nodeid }, (err, node) => {
    if (node) {
      // If the node classes are empty build a new one. Else use the db.

      let classes = {}
      let state = {}

      if (node.classes != null) {
        classes = node.classes
      }

      // If the target class is empty build a new one
      if (classes[ targetComclass ] == null) {
        classes[ targetComclass ] = {}
      }
      // Insert a new class entry and value or update the old one.
      classes[ targetComclass ][ targetValue.index ] = targetValue
      node.classes = classes
      node.markModified('classes')
      node.save((err) => {
        if (err) {
          console.log('error updating node')
        }
      })

      let event = {}

      event.deviceType = node.product
      event.deviceCategory = node.type
      event.manufacturer = node.manufacturer
      event.node_id = nodeid
      event.node_db_id = node._id.toString()
      event.manufacturer_id = node.manufacturerid
      event.product_id = node.productid
      event.product_type = node.producttype
      event.class_id = comclass
      event.value_index = value.index
      event.units = value.units
      event.value_label = value.label
      event.value = value.value

      eventHandler(event, node)
    }
    if (err) {
      console.log(err)
    }
  })
})

// Value change event
zwave.on('value changed', (nodeid, comclass, value) => {

  ZedNode.findOne({ 'nodeid': nodeid }, (err, node) => {
    if (node) {
      // if we have a node
      //  console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass
      //  value['label'],
      //			node.classes[comclass][value.index]['value'],
      //				value['value'])
      // If the node classes are empty build a new one. Else use the db.
      let targetComclass = comclass
      let targetValue = value


      let classes = {}

      if (node.classes != null) {
        classes = node.classes
      }
      // If the target class is empty build a new one
      if (classes[ targetComclass ] == null) {
        classes[ targetComclass ] = {}
      }
      // Insert a new class entry and value or update the old one.
      classes[ targetComclass ][ targetValue.index ] = targetValue
      node.classes = classes
      node.markModified('classes')
      node.save((err) => {
        if (err) {
          console.log('error updating node')
        }
      })

      let event = {}

      event.deviceType = node.product
      event.deviceCategory = node.type
      event.manufacturer = node.manufacturer
      event.node_id = nodeid
      event.node_db_id = node._id.toString()
      event.manufacturer_id = node.manufacturerid
      event.product_id = node.productid
      event.product_type = node.producttype
      event.class_id = comclass
      event.value_index = value.index
      event.units = value.units
      event.value_label = value.label
      event.value = value.value

      eventHandler(event, node)
      zwave.writeConfig()
    }
    if (err) {
      console.log(err)
    }
  })
})

zwave.on('value removed', (nodeid, comclass, index) => {
  // Value removed
})
// Event when a node is ready
zwave.on('node ready', (nodeid, nodeinfo) => {
  ZedNode.findOne({ 'nodeid': nodeid }, (err, node) => {
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
      node.save((err) => {
        if (err) {
          console.log('error saving node')
        }
        console.log('node saved and ready')
      })

      if (node.classes) {
        for (let comclass in node.classes) {
          if (comclass) {
            if (comclass == 37) {
              console.log(`Enable Poll polling on switch: ${ nodeid}`)
              // zwave.enablePoll({ node_id: nodeid, class_id: 37, instance:1, index:0}, 1)
              zwave.disablePoll({ 'node_id': nodeid, 'class_id': 37, 'instance': 1, 'index': 0 })

            }
          }

          let values = node.classes[ comclass ]

          console.log('node %d: class %d', nodeid, comclass)
          for (let idx in values) {
            if (idx) {
              console.log(
                'node%d:   %s=%s',
                nodeid,
                values[ idx ].label,
                values[ idx ].value)
            }
          }
        }
      }
    }
    if (err) {
      console.log(err)
    }
  })
  zwave.writeConfig()
})


zwave.on('notification', (nodeid, notif) => {
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
  default:
    console.log('unknown')
  }
})

zwave.on('scan complete', () => {
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

zwave.on('controller command', (n, rv, st, msg) => {
  console.log('controller commmand feedback: %s node==%d, retval=%d,state=%d',
    msg, n, rv, st)
})


zwave.connect('/dev/cu.usbmodem14741')

process.on('SIGINT', () => {
  console.log('disconnecting...')

  zwave.disconnect('/dev/cu.usbmodem14741')
  process.exit()
})
