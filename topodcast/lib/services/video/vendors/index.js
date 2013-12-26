var serviceNames = ['youku', '56', 'tudou', 'qq'];

// Load vendor handlers
var handlers = {};
serviceNames.forEach(function(serviceName) {
  var sourceFileName;

  if (typeof serviceName === 'string') {
    sourceFileName = serviceName;
  }
  else {
    var key = Object.keys(serviceName)[0];
    sourceFileName = serviceName[key];
    serviceName = key;
  }

  handlers[serviceName] = require('./' + sourceFileName);
});

module.exports = handlers;