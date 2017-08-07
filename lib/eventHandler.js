  import http from 'http'

  export default function eventHandler(nodeid, comclass, value, units, type) {


  let EventBody = JSON.stringify({
		value: String(value),
		type: type,
		units: units,
		uuid: nodeid,
    entity_id: null,
    service_id: 4,
		date: new Date().toISOString(),
		source: 'zedwave',
  })

	let event_options = {
    hostname: '10.10.10.243',
    port: 4000,
    path: '/api/v1/events',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(EventBody),
    },
  }

  let StateBody = JSON.stringify({
    state: {
      [type]: value,
    },
    uuid: nodeid,
  })

  let state_options = {
    hostname: '10.10.10.243',
    port: 4000,
    path: '/api/v1/entities/update_state',
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     'Content-Length': Buffer.byteLength(StateBody),
    },
  }


  let eventReq = http.request(event_options, (res) => {
  //  console.log(`STATUS: ${res.statusCode}`)
  //  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`)
      console.log("Data Sent")
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  })

	eventReq.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
	})

	eventReq.write(EventBody)
	eventReq.end()


  let stateReq = http.request(state_options, (res) => {
    //console.log(`STATUS: ${res.statusCode}`)
    //console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`)
      console.log("Data Sent")
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  })

  stateReq.on('error', (e) => {
    console.log(`problem with request: ${e.message}`)
  })

  stateReq.write(StateBody)
  stateReq.end()
}
