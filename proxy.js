var conf = require('./convict.js'), 
  http = require('http'),
  httpProxy = require('http-proxy'),
  options = {
    router: {
     "quiver.is": conf.get('quiver_host') + ":" + conf.get('quiver_port'),
     "bootstrap.quiver.is": "127.0.0.1:9100"
    }
  },
server = httpProxy.createServer(options);

