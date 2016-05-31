const exec = require('child_process').exec;

export default function scan(cb) {
  // -oX -
  //  + cidr.range
  scanHosts((hosts) => {
    return cb(hosts);
  })
}

function scanHosts(cb){
  exec('nmap -sP 10.0.1.1/24', function(err, _out, _err){
    var hosts = [];
    _out.split('scan').map((line) => {
      if (line.indexOf('report')>=0) {
        var host = {}
        line.split('\n').map((sub) => {
          if (sub.indexOf('for ')>=0) {
            host.ip = sub.split('for ')[1]
          }
          if (sub.indexOf('MAC Address: ')>=0) {
            let parts = sub.split('MAC Address: ')[1].split('(')
            host.mac = parts[0].trim()
            host.vendor = parts[1].replace(')','')
          }
        })
        if (host.vendor)
          hosts.push(host)
      }
    })
    return cb(hosts)
  })
}
