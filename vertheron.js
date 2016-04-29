        var http = require('http'),
         connect = require('connect'),
       httpProxy = require('http-proxy'),
              ui = require('./lib/verth_ui'),
             arp = require('./lib/poision'),
         monitor = require('./lib/verthLogger'),
           proxy = require('./lib/verthProxy'),
transformerProxy = require('transformer-proxy');

function Vertheron(){
  arp.setInterface(process.argv[2] || 'en0')
  monitor.mount(ui.init())
  proxy.init()
}

proxy.on('output', (data) => {
  ui.toWidget(data.target, data.message)
})

monitor.on('output', (data) => {
  ui.toWidget(data.target, data.message)
})

ui.on('poision', (target, self) => {
  arp.poison(target, self);
});

ui.on('heal', (target, gateway) => {
  arp.heal(target, gateway);
  proxy.stopSSLStripAttack()
})

Vertheron()
