var bunyan = require('bunyan');

// Transform string config into stream objects
var config = Object.deepClone(CONFIG.logger);
if (typeof config.streams !== 'undefined') {
  config.streams.forEach(function(stream) {
    if (typeof stream.stream !== 'undefined') {
      var realStream = eval(stream.stream);

      if (stream.stream === 'process.stdout' || stream.stream === 'process.stderr') {
        var PrettyStream = require('bunyan-prettystream');
        var prettyStdOut = new PrettyStream();
        prettyStdOut.pipe(realStream);
        realStream = prettyStdOut;
      }

      stream.stream = realStream;
    }
  });
}

module.exports = (function() {
  var logger = bunyan.createLogger(config);

  var methodNames = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  var originalMethods = {};

  methodNames.forEach(function(method) {
    originalMethods[method] = logger.__proto__[method];
  });

  methodNames.forEach(function(method) {
    logger.__proto__[method] = function() {
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

  return logger;
})();