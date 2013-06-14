var convict = require('convict'),
conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  quiver_host: {
      doc: "Quiver host",
      format: "ipaddress",
      default: "127.0.0.1",
      env: "QUIVER_HOST"
  },
  quiver_port: {
    doc: "Quiver port",
    format: "port",
    default: 9000,
    env: "QUIVER_PORT"
  },
  quake_host: {
      doc: "Quake host",
      format: "ipaddress",
      default: "127.0.0.1",
      env: "QUAKE_HOST"
  },
  quake_port: {
      doc: "Quake port",
      format: "port",
      default: 9001,
      env: "QUAKE_PORT"
  }

});

conf.validate();

module.exports = conf;
