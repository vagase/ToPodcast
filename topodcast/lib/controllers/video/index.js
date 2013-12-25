var restify = require('restify');
var services = require("./../../");
var Service = require('.service');
var flow = require('../../flows');


////////////////////////////////////////////////////////////////////////////////

var videos = function (req, res, next) {
  flow.success(req, res, next, {
    videoTypes: Service.getServicesName()
  });
}

////////////////////////////////////////////////////////////////////////////////

videos.service = function (req, res, next) {
  try {
    var service = Service.getServiceWithName(req.params.service);
  }
  catch (error) {
    flow.error(req, res, next, error);
    return;
  }

  flow.success(req, res, next, {
    supportedTypes: Object.keys(service)
  });
}

////////////////////////////////////////////////////////////////////////////////

videos.service.videoID.internalErrorToResponseError = function(internalError) {
  var result;

  if (internalError instanceof restify.InvalidContentError) {
    result = new restify.ResourceNotFoundError('Invalid video id');
  }
  else if (internalError instanceof restify.HttpError) {
    result = new restify.InternalError('External http call error');
  }
  else {
    result = new restify.InternalError('Internal server error');
  }

  return result;
};

videos.service.videoID = function (req, res, next) {
  try {
    var service = Service.getServiceWithName(req.params.service);
  }
  catch (error) {
    flow.error(req, res, next, error);
  }

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
          flow.error(req, res, next, videos.service.videoID.internalErrorToResponseError(error));
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