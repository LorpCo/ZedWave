import eventHandler from '../eventHandler'

export function handleEvent(event, node) {
  switch(event.class_id){
    case 48:
        eventHandler(
          event.node_db_id,
          event.class_id,
          event.value,
          event.units,
          'motion')
    break
  }
}
