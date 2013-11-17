var express = require("express");
var log4js = require("log4js");
var LOG = require("./logger");
var CONFIG = require("config");

////////////////////////////////////////////////////////////////////////////////
var logger = LOG.getLogger("main.js");
logger.debug("Configurations loaded: " + JSON.stringify(CONFIG));

var app = express();

////////////////////////////////////////////////////////////////////////////////
// Configurations
app.configure(function() {
  app.set('title', CONFIG.server.title);
  //app.use(express.logger());
  app.use(express.urlencoded())
  app.use(express.json())
  app.use(express.cookieParser());
});

app.configure("development", function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure("production", function() {
  app.use(express.compress());
  app.use(express.errorHandler());
  app.use(log4js.connectLogger(LOG.getHttpAccessLogger()));
});

////////////////////////////////////////////////////////////////////////////////
// Routes
var routes = require('./routes');
app.get("/", routes.index);
app.get("/health", require('./routes/health').health);

////////////////////////////////////////////////////////////////////////////////
// Startup
app.listen(CONFIG.server.port);
logger.info("Listening on port: " + CONFIG.server.port);