import eventHandler from '../eventHandler'

export function handleEvent(event, node) {
  switch(event.class_id){
    case 37:
    if (event.value == true) {
      eventHandler(
        event.node_db_id,
        event.class_id,
        'on',
        event.units,
        'switch')

        node.lorpState.switch = 'on'
        node.markModified('lorpState')
        node.save()
        console.log(node.lorpState)
    }
    if (event.value == false) {
      eventHandler(
        event.node_db_id,
        event.class_id,
        'off',
        event.units,
        'switch')


        node.lorpState.switch = 'off'
        node.markModified('lorpState')
        node.save()
        console.log(node.lorpState)
    }


    break

    case 50:
      if (event.value_index == 0) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'energy')
          node.lorpState.energy = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
      }

      if (event.value_index == 8) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'power')
          node.lorpState.power = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)

      }
      if (event.value_index == 20) {
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'current')
          node.lorpState.current = event.value
          node.markModified('lorpState')
          node.save()
          console.log(node.lorpState)
      }
    break
  }
}
