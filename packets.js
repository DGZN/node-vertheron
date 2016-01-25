const clc = require('cli-color');
const debug = require('debug')('debug:packets')
const error = require('debug')('errors:packets')
const lazy = require('lazy');
const spawn = require('child_process').spawn;

const filter = 'wlan.fc.type==0 && (wlan.fc.subtype==4 || wlan.fc.subtype==5)'
const tShark = spawn('tshark', ['-I', '-p', '-S', '[EOP]', '-V' ]);

var body = ''
var parser = new lazy()

process.stdout.write(clc.erase.screen);

tShark.stdout.setEncoding('utf8')
tShark.stdout.on('data', (data) => {
  if (data)
    parser.emit('data', data)
})

parser.on('data', (data) => {
  body += data;
})

var parsePackets = setInterval(() => {
  if (body.length)
    parseBody(body)
}, 500)

parser.on('end', () => {
  debug('-- Parser Stream Ended -- ')
  clearInterval(parsePackets)
})

tShark.on('close', () => {
  parser.end()
})

var errors = 0;
tShark.stderr.on('data', (err) => {
  if (errors++ > 1)
    error(err)
})

function parseBody(data){
  var packets = data.split('[EOP]')
  if (!packets.length)
    return;
  body = '';
  packets.map((packet) => {
    if (packet.length>1)
      process.nextTick(() => {
        printPacket(packet)
      })
  })
}

function printPacket(data){
  var packet = {
    type:    getType(data)
  , ssid:    getSSID(data)
  , antenna: getAntenna(data)
  , headers: getHeaders(data)
  }
  if (packet.ssid && packet.headers) {
    var msg = getPacketHr(packet)
            + clc.xterm(39).bold(' Packet:       ') + clc.white.bold.bgRed(getSSIDType(packet)) + clc.black('\n')
            + formatHeaders(packet.headers)
            + clc.xterm(39).bold(' Radio:        ' + getRadioBar(packet.antenna.signal))
            + getPacketHr(packet)
    process.stdout.write(msg)
  }
}


function getSSIDType(packet){
  switch (packet.type) {
    case 'Probe Response':
      return 'Probe Response from ' + packet.ssid
      break;
    case 'Probe Request':
      return 'Probe Request from ' + packet.headers.source.address.split(' ')[0]
      break;
    case 'Beacon frame':
      return 'Beacon Frame from ' + packet.ssid
      break;
    case 'Association Request':
      return 'Association Request to ' + packet.ssid
      break;
    default:
      return packet.type + ' from ' + packet.headers.destination.address.split(' ')[0]
  }
}

function getRadioBar(signal){
  if (parseInt(signal) <= -60)
    return clc.red('low ' + signal)
  if (parseInt(signal) <= -55)
    return clc.yellow('medium ' + signal)
  if (parseInt(signal) <= -45)
    return clc.cyan('strong   ' + signal)
  return clc.green('excellent  ' + signal)
}

function getPacketHr(packet){
  var packetTypeLength = getSSIDType(packet).length;
  var source = packet.headers.source.address
  var destination = packet.headers.destination.address
  var addressLength = source.length
  if (source.length < destination.length)
    addressLength = destination.length

  var count = addressLength;
  if (packetTypeLength > addressLength)
    count = packetTypeLength;
  count = (count + 15) / 2
  var hr = '';
  for (i=0; i < count; i++) {
    hr += '- '
  }
  return clc.black('\n ') + clc.xterm(14)(hr + '\n')
}


function formatHeaders(headers){
  var source = headers.source.address
  var destination = headers.destination.address.split(' ')
  var wsCount = source.length - headers.destination.address.length
  if (source.length < headers.destination.address.length)
    var wsCount = headers.destination.address.length - source.length

  var formatted =  clc.xterm(39).bold(' Source:       ') + clc.white(source + '\n')
      formatted += clc.xterm(39).bold(' Destination:  ') + clc.white(destination[0] + padding(wsCount) + destination[1] + '\n')

  if (source.length < headers.destination.address.length) {
    source = source.split(' ')
    var formatted =  clc.xterm(39).bold(' Source:       ') + clc.white(source[0] + padding(wsCount) + source[1] + '\n')
        formatted += clc.xterm(39).bold(' Destination:  ') + clc.white(destination[0] + ' ' + destination[1] + '\n')
  }

  return formatted;
}

function padding(int){
  var padding = ''
  for (i =-1; i < int; i++) {
    padding += ' '
  }
  return padding;
}

function getType(packet){
  var match = packet.match(/Subtype:.*/g);
  if (!match)
    return '';
  return match[0].split('(')[0].trim().split(': ')[1]
}

function getSSID(packet){
  var match = packet.match(/SSID.*/g);
  if (!match)
    return '';
  return match[0].split(' ')[3];
}

function getAntenna(packet){
  var data = packet.match(/(SSI)\s\w*:\s-\d*\s\w*/g);
  if (!data)
    return '';
  var antenna = {
    signal: data[0].split(':')[1].replace(' ','')
  }
  if (data[1])
    antenna['strength'] = data[1].split(':')[1].replace(' ','')
  return antenna;
}

function getHeaders(packet){
  var headers = {}
  var receiver = packet.match(/Receiver.*/)
  if (receiver) {
    var address = receiver[0].split(' ');
    headers['receiver'] = {
      address: address[2] + ' ' + address[3]
    }
  }
  var destination = packet.match(/Destination.*/)
  if (destination) {
    var address = destination[0].split(' ');
    headers['destination'] = {
      address: address[2] + ' ' + address[3]
    }
  }
  var transmitter = packet.match(/Tansmitter.*/)
  if (transmitter) {
    var address = transmitter[0].split(' ');
    headers['transmitter'] = {
      address: address[2] + ' ' + address[3]
    }
  }
  var source = packet.match(/Source.*/)
  if (source) {
    var address = source[0].split(' ');
    headers['source'] = {
      address: address[2] + ' ' + address[3]
    }
    return headers;
  }
}
