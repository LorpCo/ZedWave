## Zedwave Server

A simple express wrapper for the OpenZwave project. Tested on Raspberry PI 3. 

### Prerequisites

https://github.com/OpenZWave/node-openzwave-shared/blob/master/README-ubuntu.md

Follow the open zwave-shared install instructions 

Clone the Repo

cd into the folder 

npm install 

### Usage


GET server:3000/api/nodes 

Lists all nodes available 

POST server:3000/api/nodes/add

Place the controller into inclusion mode

POST server:3000/api/nodes/remove

Remove a node

GET server:3000/api/nodes/:nodeId 

List a single node


