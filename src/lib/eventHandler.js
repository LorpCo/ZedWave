import http from 'http'
import prettyjson from 'prettyjson'

export default function eventHandler(event, node) {

  const event_host = null
  const event_host_port = null
  const jsonOptions = {
    'noColor': false
  }
  let EventBody = JSON.stringify(event)


  console.log(prettyjson.render(event, jsonOptions))
  let event_options = {
    'hostname': event_host,
    'port': event_host_port,
    'path': '/api/v1/events',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(EventBody)
    }
  }

  if (event_host) {
    let eventReq = http.request(event_options, (res) => {
      console.log(`STATUS: ${res.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`)
        console.log('Data Sent')
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
  }

}
