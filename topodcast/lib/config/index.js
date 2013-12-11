/**
 *
 * Load configurations
 *
 */

var fs = require('fs');
var path = require('path');

var nodeEnv = process.env['NODE_ENV'];
if (typeof nodeEnv === 'undefined') {
  throw new Error('No \"NODE_EN\" enviroment set, please fix it and try again.');
}

var configText = fs.readFileSync(path.resolve(__dirname, 'default.json'), 'utf8');
var envConfigText = fs.readFileSync(path.resolve(__dirname, nodeEnv +'.json'), 'utf8');

var config = JSON.parse(configText);
var envConfig = JSON.parse(envConfigText);

// Deep extend default config with specified env config.
Object.deepExtend(config, envConfig);
module.exports = config;