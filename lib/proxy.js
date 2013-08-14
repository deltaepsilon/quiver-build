var http = require('http'),
  httpProxy = require('http-proxy'),
  REGEX_QUIVER = /quiver\.is/,
  httpOptions = {
    hostnameOnly: true,
    router: {
      "istilllovecalligraphy.com": "127.0.0.1:8080",
      "dev.istilllovecalligraphy.com": "127.0.0.1:8080",
      "local.istilllovecalligraphy.com": "127.0.0.1:8080",
      "melissaesplin.com": "127.0.0.1:8080",
      "m.melissaesplin.com": "127.0.0.1:8080",
      "dev.melissaesplin.com": "127.0.0.1:8080"
    }
  };


httpProxy.createServer(function (req, res, next) {
  if(!req.headers.host.match(REGEX_QUIVER) || req.headers.host === 'local.istilllovecalligraphy.com') {
    next();
  } else {
    res.writeHead(302, {
      'Location': 'https://' + req.headers.host + req.url
    });
    res.end();
  }
}, httpOptions).listen(80);

var conf = require('./../config/convict.js'), 
  fs = require('fs'),
  http = require('http'),
  http = require('https'),
  httpProxy = require('http-proxy'),
  options = {
    hostnameOnly: true,
    https: {
      key: fs.readFileSync(__dirname + '/../ssl/myserver.key', 'utf8'),
      cert: fs.readFileSync(__dirname + '/../ssl/STAR_quiver_is.crt', 'utf8')
    },
    router: {
     "quiver.is": conf.get('quiver_host') + ":" + conf.get('quiver_port'),
     "dev.quiver.is": conf.get('quiver_host') + ":" + conf.get('quiver_port'),
     "api.quiver.is": conf.get('quake_host') + ":" + conf.get('quake_port'),
     "devapi.quiver.is": conf.get('quake_host') + ":" + conf.get('quake_port'),
     "bootstrap.quiver.is": "127.0.0.1:9100",
     "devbootstrap.quiver.is": "127.0.0.1:9100",
     "githook.quiver.is": "127.0.0.1:9200",
     "calligraphy.quiver.is": "127.0.0.1:8080",
     "diagnostic.quiver.is": "127.0.0.1:8080"
    }
  },
  cors_headers = {
    'access-control-allow-methods': 'HEAD, POST, GET, PUT, PATCH, DELETE',
    'access-control-max-age': '86400',
    'access-control-allow-headers': 'accept, accept-charset, accept-encoding, accept-language, authorization, content-length, content-type, host, origin, proxy-connection, referer, user-agent, x-requested-with',
    'access-control-allow-credentials': 'true'
  };

  // app.all('/*', function (req, res) {
  //   return proxy.proxyRequest(req, res, options)
  // });
  
  var server = httpProxy.createServer(function (req, res, next) {
    //console.log('req.url: ', req.url);
    cors_headers['access-control-allow-origin'] = req.headers.origin || '*';
    if (req.method === 'OPTIONS') {
      res.writeHead(200, cors_headers);
      res.end();
    } else {
      next();
    }
    
  }, options);

server.listen(443);
