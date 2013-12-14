var bunyan = require('bunyan');

/**
 * Custom bunyan logger, extend its behaviour, as adding location field and handy log apis.
 * @param logger
 */
var customBunyanLogger = function(logger) {
  var methodNames = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  var originalMethods = {};

  methodNames.forEach(function(method) {
    originalMethods[method] = logger[method];
  });

  methodNames.forEach(function(method) {
    logger.method = function() {
      var stackback = 1;

      var vars = Array.prototype.slice.call(arguments);

      if (vars.length > 1) {
        var tmp = vars.pop();
        if (typeof tmp === 'number') {
          stackback = tmp;
        }
        else {
          vars.push(tmp);
        }
      }

      var stack = __stack[stackback];
      var fileLineNumber = stack.getFileName() + ':' + stack.getLineNumber();
      logger.fields['location'] = fileLineNumber;

      originalMethods[method].apply(logger, vars);
    };
  });

  logger.logError = function(context, error) {
    logger.warn(context + '\n' + error, 2);
  };

  logger.logRequestResponseError = function(request, response, error) {
    if (typeof request !== 'string') {
      request = JSON.stringify(request);
    }

    if (typeof response !== 'string') {
      response = JSON.stringify(response);
    }

    logger.warn('Request: ' + request + ' - Response: ' + response + '\n' + error.stack, 2);
  };
}

/**
 * Create bunyan logger from configuration.
 * @param config
 * @returns {*}
 */
var createBunyanLogger = function(config) {
  // Transform string config into stream objects
  config = Object.deepClone(config);
  if (typeof config.streams !== 'undefined') {
    config.streams.forEach(function(stream) {
      if (typeof stream.stream !== 'undefined') {
        var realStream = eval(stream.stream);

        if (stream.stream === 'process.stdout' || stream.stream === 'process.stderr') {
          // Use bunyan-prettystream instead of raw stdout for pretty printing directly.
          var PrettyStream = require('bunyan-prettystream');
          var prettyStdOut = new PrettyStream();
          prettyStdOut.pipe(realStream);
          realStream = prettyStdOut;
        }

        stream.stream = realStream;
      }
    });
  }

  return bunyan.createLogger(config);
}

/**
 * Create bunyan logger from configuration and custom it.
 * @param config
 * @returns {*}
 */
var createCustomBunyanLogger = function(config) {
  var logger = createBunyanLogger(config);
  customBunyanLogger(logger);
  return logger;
}

module.exports = {
  'defaultLogger': createCustomBunyanLogger(CONFIG.log.defaultLogger),
  'httpAccessLogger': createBunyanLogger(CONFIG.log.httpAccessLogger)
}