## Zedwave Server

A simple express wrapper for the OpenZwave project. Tested on Raspberry PI 3. 

### Prerequisites

https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-ubuntu.md

Follow the open zwave-shared install instructions 

Clone the Repo

cd into the folder 

npm install 

### Usage

Fetch all of the nodes

```
GET server:3000/api/nodes 
```

Fetch a single node 

```
GET server:3000/api/nodes/:nodeid
```

Add a node to your zwave network

```
POST server:3000/api/nodes/add

```

Remove a node

```
POST server:3000/api/nodes/remove
```


