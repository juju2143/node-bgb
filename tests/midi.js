// This script links MIDI devices to a Game Boy emulator running LSDJ or mGB
// Do a `npm install midi` first
// In bgb right click>Link>Listen on port 8765 and run this

var midi = require('midi');
var bgb = require('../index');

var input = new midi.input();
var emu = new bgb();

emu.connect(8765);

emu.on('data', (b1,b2,b3,b4,t)=>{
  console.log('b1: ', b1,'b2: ', b2,'b3: ', b3,'b4: ', b4,'t: ', t);
});

input.on('message', (deltaTime, message) => {
    //console.log('m:' + message + ' d:' + deltaTime);
    emu.sendSync1(message[0]);
    emu.sendSync1(message[1]);
    emu.sendSync1(message[2]);
});

input.openPort(0);