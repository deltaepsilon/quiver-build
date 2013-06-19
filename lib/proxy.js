var conf = require('./../config/convict.js'), 
  fs = require('fs'),
  http = require('http'),
  http = require('https'),
  httpProxy = require('http-proxy'),
  options = {
    hostnameOnly: true,
    https: {
      key: fs.readFileSync('./ssl/key.pem', 'utf8'),
      cert: fs.readFileSync('./ssl/cert.pem', 'utf8')
    },
    router: {
     "dev.quiver.is": conf.get('quiver_host') + ":" + conf.get('quiver_port'),
     "api.dev.quiver.is": conf.get('quake_host') + ":" + conf.get('quake_port'),
     "bootstrap.quiver.is": "127.0.0.1:9100",
     "githook.quiver.is": "127.0.0.1:9200"
    }
  },
  server = httpProxy.createServer(options);

  console.log('router', options);

server.listen(443);