var bunyan = require('bunyan');
var util = require('util');

var BunyanLoggerEx = function() {
  bunyan.apply(this, arguments);
}
util.inherits(BunyanLoggerEx, bunyan);

/**
 * Override 'trace', 'debug', 'info', 'warn', 'error', 'fatal' methods.
  */

var overrideMethods = false;
if (overrideMethods) {
  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(function(method){
    BunyanLoggerEx.prototype[method] = function() {
      var logger = this;

      var stackback = 1;
      var vars = Array.prototype.slice.call(arguments);
      if (vars.length > 1) {
        var tmp = vars.pop();
        // If the last argument is number, that means the log stack roll back level.
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

      bunyan.prototype[method].apply(logger, vars);
    };
  });
}

BunyanLoggerEx.prototype.logError = function (error, message, body) {
  if (!error) {
    throw new Error('error parameter MUST not be null');
  }

  var content = message ? message : '';

  if (body) {
    if (content) {
      content += ' ';
    }
    content += body;
  }

  if (content) {
    content += '\n';
  }

  content += error.stack;

  this.warn(content, 2);
}

BunyanLoggerEx.prototype.logErrorWithReqRes = function(error, req, res) {
  if (!error) {
    throw new Error('error parameter MUST not be null');
  }

  var content = '';

  if (req) {
    content += 'Request: ' + req;
  }

  if (res) {
    if (content) {
      content+= '\n';
    }

    content += 'Response:' + res;
  }

  if (content) {
    content += '\n';
  }
  content += error.stack;

  this.warn(content, 2);
}

////////////////////////////////////////////////////////////////////////////////

/**
 *  Parse config into bunyan friendly format.
 * */
var parseConfig = function(config) {
  if (!config) {
    return null;
  }

  try {
    var result = Object.deepClone(config);

    // Transform string config into stream objects
    if (typeof result.streams !== 'undefined') {
      result.streams.forEach(function(stream) {
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

    return result;
  }
  catch (error) {
    console.error('Error occurred while parsing log config: ' + error.stack);
    throw error;
  }
}

/**
 * Logger creation factory method.
 */
var createLogger = function(config, loggerClass) {
  var loggerConfig = parseConfig(config);
  var logger;

  if (loggerConfig) {
    logger = new loggerClass(loggerConfig);
  }

  return logger;
}

////////////////////////////////////////////////////////////////////////////////

module.exports = {
  'defaultLogger': createLogger(CONFIG.log.defaultLogger, BunyanLoggerEx),
  'httpAccessLogger': createLogger(CONFIG.log.httpAccessLogger, bunyan)
};