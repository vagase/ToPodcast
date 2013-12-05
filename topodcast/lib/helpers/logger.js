var CONFIG  = require("config");
var log4js  = require("log4js");
var path    = require("path");

// log4js configuration
log4js.configure(CONFIG.log4js);

var getLogger = function(filename) {
  var loggerName = path.relative(CONFIG.var.projectRootDir, filename);
  return log4js.getLoggerNameCategory(loggerName, "default_logger");
}

exports.getLogger = getLogger;