var CONFIG  = require("config");
var log4js  = require("log4js");
var path    = require("path");

// log4js configuration
log4js.configure(CONFIG.log4js);

var getLogger = function(filename) {
  var logger = log4js.getLogger("default_logger");
  logger.category = filename;
  return logger;
}

var loggerName = function(filename) {
  return path.relative(CONFIG.var.projectRootDir, filename);
}

exports.getLogger = getLogger;
exports.loggerName = loggerName;