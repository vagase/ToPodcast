var routes = require("./routes");

var routeRules = [
  {
    method : "GET | POST",
    path: "/",
    handlers : routes.index
  },
  {
    method : "GET",
    path : "/health",
    handlers : routes.health
  }
];

exports.routeRules = routeRules;