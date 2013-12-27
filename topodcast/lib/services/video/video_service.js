var vendors = require("./vendors");
var Error = require('../../error');

////////////////////////////////////////////////////////////////////////////////

var VideoService = function(name, handlers) {
  this.name = name;

  var _handlers = this.handlers = {};
  handlers.forEach(function(handler) {
    _handlers[handler.format] = handler;
  });
};

////////////////////////////////////////////////////////////////////////////////

// Load services
var services= {};
for (var vendor in vendors) {
  services[vendor] = new VideoService(vendor, vendors[vendor]);
}

VideoService.getServicesName = function() {
  return Object.keys(services);
};

VideoService.getServiceWithName = function(name) {
  var service = services[name];
  if (service) {
    return service;
  }
  else {
    throw Error.InvalidArgumentError('Unsupported video service: ' + name);
  }
};

////////////////////////////////////////////////////////////////////////////////

VideoService.prototype.getSupportedFormats = function () {
  return Object.keys(this.handlers);
};

VideoService.prototype.getVideoInfo = function(videoId, format, callback) {
  if (!videoId) {
    throw Error.InvalidArgumentError("Missing video id parameter");
  }

  // If no format parameter, then get all supported formats.
  var formats = (format) ? [format] : this.getSupportedFormats();
  var handlers = this.getHandlersForFormats(formats);

  var result = {};

  var processHandlers = function (handlers) {
    var handler = handlers.shift();
    if (handler) {
      handler.process(videoId, function (error, videoInfo) {
        if (!error) {
          Object.extend(result, videoInfo);
          processHandlers(handlers);
        }
        else {
          callback(error);
        }
      });
    }
    else {
      // No more handler
      callback(null, result);
    }
  }

  processHandlers(handlers);
};

////////////////////////////////////////////////////////////////////////////////

VideoService.prototype.getHandlersForFormats = function (formats) {
  var result = [];

  var _handlers = this.handlers;
  formats.forEach(function(format) {
    var handler = _handlers[format];
    if (handler) {
      result.push(handler);
    }
    else {
      throw Error.InvalidArgumentError('Unsupported video format: ' + format);
    }
  });

  return result;
};

////////////////////////////////////////////////////////////////////////////////

module.exports = VideoService;