## Zedwave Server

A simple express wrapper for the OpenZwave project. Tested on Raspberry PI 3.

### Prerequisites

https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-ubuntu.md

Follow the open zwave-shared install instructions


You will need to have mongodb installed and availabe.

Clone the Repo

cd into the folder

``` console
npm install
```

Run in Debug Mode

``` console
npm run dev
```

Run as a daemon

``` console
forver start index.js
```

### Sample routes

Fetch all of the nodes

``` console
GET /api/nodes
```

Fetch a single node

```console
GET /api/nodes/:nodeid
```

Delete a single node

``` console
DELETE /api/nodes/:nodeid
```

Fetch a the classes for a node

``` console
GET /api/nodes/:nodeid/classes
```

Add a node to your zwave network

``` console
POST /api/nodes/add
```

Remove a node

``` console
POST /api/nodes/remove
```
