require("./helpers/language-ext");
require("./helpers/node-ext");

global.CONFIG = require('./config');
global.logger = require('./helpers/log').defaultLogger;
global.CallbackAdapter = require('./helpers/callback').CallbackAdapter;

logger.info("Configurations loaded: " + JSON.stringify(CONFIG));
