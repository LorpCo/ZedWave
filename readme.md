## Zedwave Server

A simple express wrapper for the OpenZwave project. Tested on Raspberry PI 3.

### Prerequisites

https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-ubuntu.md

Follow the open zwave-shared install instructions


You will need to have mongodb installed and availabe.

Clone the Repo

cd into the folder

```
npm install
```
Run in Debug Mode

```
node index.js
```

Run as a daemon

```
forver index.js
```

### Usage

Fetch all of the nodes

```
GET server:3000/api/nodes
```

Fetch a single node

```
GET server:3000/api/nodes/:nodeid
```

Fetch a the classes for a node

```
GET server:3000/api/nodes/:nodeid/classes
```

Add a node to your zwave network

```
POST server:3000/api/nodes/add
```

Remove a node

```
POST server:3000/api/nodes/remove
```
