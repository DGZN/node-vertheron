        var http = require('http'),
         connect = require('connect'),
       httpProxy = require('http-proxy'),
              ui = require('./lib/verth_ui'),
             arp = require('./lib/poision'),
          logger = require('./lib/verthLogger'),
           proxy = require('./lib/verthProxy'),
transformerProxy = require('transformer-proxy');

arp.setInterface('en1')
ui.init()
logger.mount(ui)
proxy.init()

proxy.on('output', (data) => {
  ui.toWidget(data.target, data.message)
})

logger.on('output', (data) => {
  ui.toWidget(data.target, data.message)
})

ui.on('poision', (target, self) => {
  arp.poison(target, self);
});

ui.on('heal', (target, gateway) => {
  arp.heal(target, gateway);
  proxy.stopSSLStripAttack()
})
