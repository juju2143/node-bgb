# node-bgb

Implements the [BGB 1.4 link protocol](http://bgb.bircd.org/bgblink.html) in a simple library.

## Installation

```
npm install juju2143/node-bgb
```

## Connect

Start BGB 1.4 or later, load a compatible ROM, right click > Link > Listen, type in 8765 as port number, then run your script:

```
var bgb = require('bgb');

var link = new bgb();

link.on('data', (b1, b2, b3, b4, t)=>{
  console.log('b1: ', b1,'b2: ', b2,'b3: ', b3,'b4: ', b4,'t: ', t);
});

link.connect(8765);

// Do some stuff here...
```

## Functions

### connect(port)

Connects to a BGB running on _port_.

### getTimestamp()

Gets current timestamp.

### sendData(b1,b2,b3,b4,i1)
### sendVersion()
### sendJoypad(button, ispressed)
### sendSync1(b, high, double)
### sendSync2(b)
### sendSync3(transfer)
### sendStatus(running, paused, supportreconnect)
### sendWantdisconnect()

## Event handlers

### 'connect'
### 'data' (b1, b2, b3, b4, i1)
### 'joypad' (button, ispressed)
### 'sync1' (b, high, double)
### 'sync2' (b)
### 'sync3' (transfer)
### 'status' (running, paused, supportreconnect)
### 'wantdisconnect'