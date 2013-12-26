// Load global objects
require("./init");

var restify = require('restify');
var installRouteRules = require('./helpers/restify-ext').installRouteRules;

var server = restify.createServer({
  name: CONFIG.server.name,
  log: logger
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.queryParser());
server.use(restify.bodyParser({ rejectUnknown: true }));
server.use(restify.fullResponse());

// add httpAccessLogger
server.on('after', restify.auditLogger({
  log: require('./helpers/log').httpAccessLogger
}));

installRouteRules(require('./routeRules'), server);

server.listen(CONFIG.server.port, function() {
  logger.info('%s starts listening at %s', server.name, server.url);
});
