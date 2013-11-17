var CONFIG = require("config");
var log4js = require('log4js');

// log4js configuration
log4js.configure(CONFIG.log4js);

var getLogger = function(filename) {
  var logger = log4js.getLogger("alert");
  logger.category = filename;
  return logger;
}

var getHttpAccessLogger = function() {
  return log4js.getLogger("http_access");
}

exports.getLogger = getLogger;
exports.getHttpAccessLogger = getHttpAccessLogger;