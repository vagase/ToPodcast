var bunyan = require('bunyan');

// Transform string config into stream objects
var config = Object.deepClone(CONFIG.logger);
if (typeof config.streams !== 'undefined') {
  config.streams.forEach(function(stream) {
    if (typeof stream.stream !== 'undefined') {
      stream.stream = eval(stream.stream);
    }
  })
}

module.exports = bunyan.createLogger(config);