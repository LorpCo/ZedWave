import eventHandler from '../eventHandler'

export function handleEvent(event, node){
  switch(event.class_id){
    case 48:
      if (event.value == true){
        eventHandler(
          event.node_db_id,
          event.class_id,
          'open',
          event.units,
          'contact')
      }

      if (event.value == false){
        eventHandler(
          event.node_db_id,
          event.class_id,
          'closed',
          event.units,
          'contact')
      }
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
      console.log("Unknown Event")
      break
  }
}
