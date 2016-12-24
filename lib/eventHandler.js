eventHandler = function(nodeid, comclass, value, units, type){
var http = require("http");


	var body  = JSON.stringify({
			value: String(value),
			type: type,
			units: units,
			entity: nodeid,
			date: new Date().toISOString(),
			source: "zedwave"
    })

	var options = {
	  hostname: '192.168.1.193',
	  port: 4000,
	  path: '/api/events',
	  method: 'POST',
	  headers: {
	      'Content-Type': 'application/json',
	      'Content-Length': Buffer.byteLength(body)
	  }
	}


    var req = http.request(options, (res) => {
	  console.log(`STATUS: ${res.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(`BODY: ${chunk}`);
	  });
	  res.on('end', () => {
	    console.log('No more data in response.');
	  });
	});

	req.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});

	req.write(body);
	req.end();

}




module.exports = eventHandler
