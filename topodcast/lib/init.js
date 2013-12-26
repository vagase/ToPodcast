require("./helpers/language-ext");
require("./helpers/node-ext");

global.CONFIG = require('./config');
global.logger = require('./helpers/log').defaultLogger;

logger.info("Configurations loaded: " + JSON.stringify(CONFIG));
