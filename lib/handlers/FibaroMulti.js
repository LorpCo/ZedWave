import eventHandler from '../eventHandler'


export function handleEvent(event, node){
  switch(event.class_id){
    case 48:
      // sensor
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'motion')
    break

    case 49:
      // sensor
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'temperature')
    break

    case 128:
      // sensor
      eventHandler(
        event.node_db_id,
        event.class_id,
        event.value,
        event.units,
        'battery')
    break

    default:
      console.log('Unknown Case')
  }

}
