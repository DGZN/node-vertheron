var exec = require('child_process').exec

exports.entries = function(cb){
  exec('arp -an', function(err, stdout, stderr){
    var entries = []
    stdout.split('\n').map((i) => {
      var entry = i.split(/[ ,]+/)
      if (entry[1])
        entries.push({
            ip:  entry[1].replace('(','').replace(')','')
          , mac: entry[3].replace(/^0:/g, '00:').replace(/:0:/g, ':00:').replace(/:0$/g, ':00')
          , interface:  entry[5]
        })
    })
    return cb(entries)
  })
}

exports.onInterface = function(interface, cb){
  exec('arp -ani ' + interface, function(err, stdout, stderr){
    var entries = []
    stdout.split('\n').map((i) => {
      var entry = i.split(/[ ,]+/)
      if (entry[1])
        entries.push({
            ip:  entry[1].replace('(','').replace(')','')
          , mac: entry[3].replace(/^0:/g, '00:').replace(/:0:/g, ':00:').replace(/:0$/g, ':00')
          , interface:  entry[5]
        })
    })
    return cb(entries)
  })
}

exports.self = function(cb){
  exec('arp -n ' + require('ip').address(), function(err, stdout, stderr){
    var entry = stdout.split(/[ ,]+/)
    var entry = {
        ip:  entry[1].replace('(','').replace(')','')
      , mac: entry[3].replace(/^0:/g, '00:').replace(/:0:/g, ':00:').replace(/:0$/g, ':00')
      , interface:  entry[5]
    }
    return cb(entry)
  })
}
