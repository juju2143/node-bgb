const net = require('net');
const EventEmitter = require('events');

class bgb extends EventEmitter {
  constructor() {
    super();
    this.timestamp = 0;
    this.status = [true, false, false];
  }
  connect(port) {
    this.socket = new net.Socket();
    this.socket.on('connect',()=>{
      this.timestamp = new Date();
      this.sendVersion();
      this.emit('connect');
    });
    this.socket.on('data',(data)=>{
      for(var i = 0; i<data.length; i+=8)
      {
        var b1 = data[i];
        var b2 = data[i+1];
        var b3 = data[i+2];
        var b4 = data[i+3];
        var i1 = (data[i+4]<<24)&(data[i+5]<<16)&(data[i+6]<<8)&data[i+7];
        switch(data[i])
        {
          case 1:
            this.sendStatus(this.status[0], this.status[1], this.status[2]);
            this.emit('version', b2, b3, b4, i1);
            break;
          case 101:
            this.emit('joypad', b2&7, b2&8);
            break;
          case 104:
            this.emit('sync1', b2, b3, b4, i1);
            break;
          case 105:
            this.emit('sync2', b2, b3);
            break;
          case 106:
            this.emit('sync3', b2, b3, b4, i1);
            break;
          case 108:
            if(!(b2&1==this.status[0]&&b2&2==this.status[1]&&b2&4==this.status[2]))
            {
              this.sendStatus(b2&1, b2&2, b2&4);
            }
            this.emit('status', b2&1, b2&2, b2&4);
            break;
          case 109:
            this.emit('wantdisconnect');
            break;
        }
        this.emit('data', b1, b2, b3, b4, i1)
      }
    });
    this.socket.setNoDelay(true);
    this.socket.connect(port);
  }
  getTimestamp() {
    return ((Date.now()-this.timestamp)*2097.152)&0x7fffffff;
  }
  sendData(b1,b2,b3,b4,t) {
    var buf = new Buffer([b1,b2,b3,b4,(t>>24)&0xff,(t>>16)&0xff,(t>>8)&0xff,t&0xff])
    this.socket.write(buf);
  }
  sendVersion() {
    this.sendData(1,1,4,0,0);
  }
  sendJoypad(button, ispressed) {
    this.sendData(101,(button&7)|((ispressed&1)<<3),0,0,0);
  }
  sendSync1(b, high, double) {
    this.sendData(104,b,129|((high&1)<<1)|((double&1)<<2),0,this.getTimestamp());
  }
  sendSync2(b) {
    this.sendData(105,b,128,0,0);
  }
  sendSync3(transfer) {
    this.sendData(106,transfer&1,0,0,(transfer&1)?0:this.getTimestamp());
  }
  sendStatus(running, paused, supportreconnect) {
    this.sendData(108,(running&1)|((paused&1)<<1)|((supportreconnect&1)<<2),0,0,0);
    this.status = [running&1, paused&1, supportreconnect&1];
  }
  sendWantdisconnect() {
    this.sendData(109,0,0,0,0);
  }
}

module.exports = bgb;