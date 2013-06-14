var conf = require('./../config/convict.js'), 
  http = require('http'),
  httpProxy = require('http-proxy'),
  options = {
    router: {
     "quiver.is": conf.get('quiver_host') + ":" + conf.get('quiver_port'),
     "bootstrap.quiver.is": "127.0.0.1:9100",
     "githook.quiver.is": "127.0.0.1:9200"
    }
  },
  server;

server = httpProxy.createServer(options);
server.listen(80);
