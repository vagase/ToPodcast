var services = require("./videoServices");
var error = require("../../../error");
var success = require("../../../success");

var logger = getLogger(__filename);

////////////////////////////////////////////////////////////////////////////////

var validateService = function (req, res, next) {
  var service = services[req.params.service];
  if (service) {
    return service;
  }
  else {
    error(req, res, next, "Unsupported service.");
    return null;
  }
}

////////////////////////////////////////////////////////////////////////////////

var videos = function (req, res, next) {
  success(req, res, next, { videoTypes: Object.keys(services) });
}

////////////////////////////////////////////////////////////////////////////////

videos.service = function (req, res, next) {
  var service = validateService(req, res, next);
  if (service) {
    success(req, res, next, { supportedTypes: Object.keys(service) });
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
      handler(req.params.videoId, function (err, result) {
        if (!err) {
          Object.extend(resultData, result);
        }
        else {
          logger.info(err);
        }

        processHandlers(handlers);
      });
    }
    else {
      if (Object.keys(resultData).length > 0) {
        success(req, res, next, resultData);
      }
      else {
        error(req, res, next, "Invalid video id.");
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
    error(req, res, next, "Invalid video format.");
  }
  else {
    processHandlers(handlers);
  }
}

////////////////////////////////////////////////////////////////////////////////

module.exports = videos;