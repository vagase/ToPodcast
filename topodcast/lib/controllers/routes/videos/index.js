var restify = require('restify');
var services = require("./services");
var flow = require('../../flows');

////////////////////////////////////////////////////////////////////////////////

var validateService = function (req, res, next) {
  var service = services[req.params.service];
  if (service) {
    return service;
  }
  else {
    flow.error(req, res, next, new InvalidArgumentError("Unsupported video service"));
    return null;
  }
}

////////////////////////////////////////////////////////////////////////////////

var videos = function (req, res, next) {
  flow.success(req, res, next, { videoTypes: Object.keys(services) });
}

////////////////////////////////////////////////////////////////////////////////

videos.service = function (req, res, next) {
  var service = validateService(req, res, next);
  if (service) {
    flow.success(req, res, next, { supportedTypes: Object.keys(service) });
  }
}

////////////////////////////////////////////////////////////////////////////////

videos.service.videoID = function (req, res, next) {
  var service = validateService(req, res, next);
  if (!service) return;

  var resultData = {};

  var processHandlers = function (handlers) {
    var handler = handlers.shift();
    if (handler) {
      handler(req.params.videoId, function (error, result) {
        if (!error) {
          Object.extend(resultData, result);
          processHandlers(handlers);
        }
        else {
          flow.error(req, res, next, error);
        }
      });
    }
    else {
      if (Object.keys(resultData).length > 0) {
        flow.success(req, res, next, resultData);
      }
      else {
        flow.error(req, res, next, new restify.ResourceNotFoundError("Invalid video id"));
      }
    }
  }

  var handlers = Object.keys(service)
    .map(function (format) {
      if (!req.params.format || req.params.format === format) {
        return service[format];
      }
      else {
        return null;
      }
    })
    .filter(function (value) {
      return value;
    });

  if (!handlers || !handlers.length) {
    flow.error(req, res, next, new restify.InvalidArgumentError("Invalid video format"));
  }
  else {
    processHandlers(handlers);
  }
}

////////////////////////////////////////////////////////////////////////////////

module.exports = videos;