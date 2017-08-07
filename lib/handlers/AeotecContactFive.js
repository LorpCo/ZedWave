import eventHandler from '../eventHandler'

export function handleEvent(event, node) {
  //Handle Contact Events

  switch(event.class_id){
    case 128:
      // sensor
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'battery')
    break
    case 113:
      // Access Control
      if (event.value_index == 9){
        console.log('access control event')
        if (event.value == 23) {
          eventHandler(
            event.node_db_id,
            event.class_id,
            'closed',
            event.units,
            'contact')
        }
        if (event.value == 22) {
          eventHandler(
            event.node_db_id,
            event.class_id,
            'open',
            event.units,
            'contact')
        }
      }

      // Tamper Alarm
      if (event.value_index == 10){
        console.log('tamper event')
        if (event.value == 0) {
          eventHandler(
            event.node_db_id,
            event.class_id,
            'secure',
            event.units,
            'tamper')
        }
        if (event.value == 3) {
          eventHandler(
            event.node_db_id,
            event.class_id,
            'alarm',
            'tamper',
            'tamper')
        }
      }
    break

    default:
      console.log('Unknown Case')
  }
}
