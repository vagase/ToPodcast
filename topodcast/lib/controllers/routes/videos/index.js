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
    var error = new InvalidArgumentError("Unsupported video service");
    logger.logRequestResponseError(req.url, null, error);
    flow.error(req, res, next, error);
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

  var internalErrorToResponseError = function(internalError) {
    var result;

    if (internalError instanceof restify.InvalidContentError) {
      result = new restify.ResourceNotFoundError('Invalid video id');
    }
    else if (internalError instanceof restify.HttpError) {
      result = new restify.InternalError('External http call error');
    }
    else {
      result = new restify.InternalError('Server internal error');
    }

    return result;
  };

  var processHandlers = function (handlers) {
    var handler = handlers.shift();
    if (handler) {
      handler(req.params.videoId, function (error, result) {
        if (!error) {
          Object.extend(resultData, result);
          processHandlers(handlers);
        }
        else {
          flow.error(req, res, next, internalErrorToResponseError(error));
        }
      });
    }
    else {
      flow.success(req, res, next, resultData);
    }
  }

  var handlers = Object.keys(service)
    // Get corresponding handlers
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
    var error = new restify.InvalidArgumentError("Invalid video format");
    logger.logRequestResponseError(req.url, null, error);
    flow.error(req, res, next, error);
  }
  else {
    processHandlers(handlers);
  }
}

////////////////////////////////////////////////////////////////////////////////

module.exports = videos;