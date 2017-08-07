import eventHandler from '../eventHandler'

export function handleEvent(event, node) {
  switch(event.class_id){
    case 128:
      // battery
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'battery')

        // Update State
        if (event.value) {
          node.lorpState.battery = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
        }

    break
    case 48:
      // Default Motion -- Unused
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'motion')
        if(event.value){
          node.lorpState.motion = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
        }

    break
    case 113:
      if (event.value_index == 10){
        if (event.value == 8){
          eventHandler(
            event.node_db_id,
            event.class_id,
            "true",
            event.units,
            'motion')

            node.lorpState.motion = true
            node.markModified('lorpState')
            node.save()
            console.log(node.lorpState)
        }


        if (event.value == 0){
          eventHandler(
            event.node_db_id,
            event.class_id,
            "false",
            event.units,
            'motion')
            node.lorpState.motion = false
            node.markModified('lorpState')
            node.save()
            console.log(node.lorpState)

        }
      }
    break
    case 49:
      if (event.value_index == 1) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'temperature')
          node.lorpState.temperature = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
      }

      if (event.value_index == 3) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'illuminance')
          if (event.value){
          node.lorpState.illuminance = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
        }
      }

      if (event.value_index == 5) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'humidity')
          if(event.value){
          node.lorpState.humidity = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
        }
      }

      if (event.value_index == 27) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'ultraviolet')
          if (event.value) {
          node.lorpState.ultraviolet = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
        }
      }
    break
  }
}
