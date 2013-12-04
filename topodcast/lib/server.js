// Load global objects
require("./init");

var restify = require('restify');
var log4js = require("log4js");
var path = require("path");
var router = require("./router");

////////////////////////////////////////////////////////////////////////////////

var logger = getLogger(__filename);
logger.info("Configurations loaded: " + JSON.stringify(CONFIG));

var server = restify.createServer({
  name: CONFIG.server.name
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.queryParser());
server.use(restify.bodyParser({
  rejectUnknown: true
}));
server.use(restify.requestLogger());
//server.use(restify.gzipResponse());

restify.defaultResponseHeaders = function(data) {
};

server.installRouterOnServer = function(server, routeRules) {
  routeRules.forEach(function(routeRule) {
    var method = routeRule.method;
    var methods = [];
    if (typeof method === "string") {
      method = method.toLowerCase().split("|").forEach(function(aMethod) {
        aMethod = aMethod.trim();
        if (aMethod === "delete") {
          aMethod = "del";
        }
        else if(aMethod === "options") {
          aMethod = "opts";
        }
        methods.push(aMethod);
      });
    } else {
      throw new TypeError("Illegal arugment for routeRules: method.");
    }

    var handlers = routeRule.handlers;
    if (!(handlers instanceof Array)) {
      handlers = [handlers];
    }
    else if (!handlers || !handlers.length ) {
      throw new TypeError("Illegal arugment for routeRules: handlers.");
    }

    var options = routeRule;
    methods.forEach(function(aMethod) {
      logger.info("Add route:\t" + aMethod.toUpperCase() + "\t" + options.path);
      server[aMethod](options, handlers);
    });
  });
}

server.installRouterOnServer(server, router.routeRules);

server.listen(CONFIG.server.port, function() {
  logger.info('%s starts listening at %s', server.name, server.url);
});
