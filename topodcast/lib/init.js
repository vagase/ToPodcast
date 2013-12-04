var path = require("path");
require("./language-ext");

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

global.util = require("./util");
