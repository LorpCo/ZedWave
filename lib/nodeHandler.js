// Import Aeotec Devices
import * as AeotecMultiSix   from './handlers/AeotecMultiSix'
import * as AeotecContactFive from './handlers/AeotecContactFive'
import * as AeotecSwitchSix from './handlers/AeotecSwitchSix'

// Import Ecolink Devices
import * as EcolinkContact from './handlers/EcolinkContact'
import * as EcolinkMotion from './handlers/EcolinkMotion'

// Import Fibaro Devices
import * as FibaroContact from './handlers/FibaroContact'
import * as FibaroMulti from './handlers/FibaroMulti'



export default function handleEvent(event, node){
  //console.log(event)

  // Set the entity ID
  let entityType = event.manufacturer_id + event.product_id + event.product_type

  switch(entityType) {
    // Aeotec Devices
    // Aeotec Gen 5 Contact
    case '0x00860x00780x0102':
      console.log('Aeotect Gen 5 Contact')
      AeotecContactFive.handleEvent(event, node)
      break
    // Aeotec Gen 6 Multi
    case '0x00860x00600x0103':
      console.log('Aeotect Gen 6 Switch')
      AeotecSwitchSix.handleEvent(event, node)
      break
    // Aeotec Gen 6 Multi
    case '0x00860x00640x0102':
      console.log('Aeotect Gen 6 Multi')
      AeotecMultiSix.handleEvent(event, node)
      break
    // Aeotec Gen 5 Multi
    case '0x00860x0005':
      console.log('Aeotect Gen 5 Multi')
      break

    // EcoLink Devices
    // Contact
    case '0x014a0x00020x0001':
      console.log('Ecolink Contact')
      EcolinkContact.handleEvent(event, node)
      break
    // Motion
    case '0x014a0x00010x0001':
      console.log('Ecolink Motion')
      EcolinkMotion.handleEvent(event, node)
      break

    // Fibaro Devices
    // Contact
    case '0x010f0x20010x0701':
      console.log('Fibaro Contact')
      FibaroContact.handleEvent(event, node)
      break
    // Multi
    case '0x010f0x20010x0800':
      console.log('Fibaro Multi')
      FibaroMulti.handleEvent(event, node)
    break

    default:

      console.log('Unknown Device')


  }
}
