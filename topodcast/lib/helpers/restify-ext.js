var restify = require('restify');

exports.installRouteRules = function(routeRules, server) {
  routeRules.forEach(function(routeRule) {
    var method = routeRule.method;
    var methods = [];
    if (typeof method === "string") {
      method = method.toLowerCase().split("|").forEach(function(method) {
        method = method.trim();
        if (method === "delete") {
          method = "del";
        }
        else if(method === "options") {
          method = "opts";
        }
        methods.push(method);
      });
    } else {
      throw new restify.InvalidArgumentError("Illegal method in route rule: " + method.toString());
    }

    var controller = routeRule.controller;
    if (!controller) {
      throw new restify.InvalidArgumentError("Illegal controller in route rule");
    }

    var options = routeRule;
    methods.forEach(function(method) {
      logger.info("Add route:\t" + method.toUpperCase() + "\t" + options.path);
      server[method](options, function(req, res, next){
        controller.execute(req, res, next);
      });
    });
  });
};

