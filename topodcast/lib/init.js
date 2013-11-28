var path = require("path");

////////////////////////////////////////////////////////////////////////////////
// Load global objects
var logger = require("./logger");
global.getLogger = logger.getLogger;
global.loggerName = logger.loggerName;

var config = require("config");
global.CONFIG = config;
if(!config.var.projectRootDir) {
  config.var.projectRootDir = path.dirname(__dirname);
}

