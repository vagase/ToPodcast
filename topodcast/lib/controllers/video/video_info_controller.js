var Handler = require('../handler');
var VideoService = require('../../services/video/video_service');
var Error = require('../../error');

var videoInfoController= new Handler();

videoInfoController.process = function (req, res, next) {
  var controller = this;

  try {
    var service = VideoService.getServiceWithName(req.params.service);
    service.getVideoInfo(req.params.videoId, req.params.format, function(error, videoInfo){
      if (error)  {
        controller.error(req, res, next, error);
      }
      else {
        controller.success(req, res, next, videoInfo);
      }
    });
  }
  catch (error) {
    controller.error(req, res, next, error);
  }
}

videoInfoController.processError = function(error) {
  var result;

  if (error instanceof Error.errors.InvalidArgumentError) {
    result = error;
  }
  else if (error instanceof Error.errors.InvalidContentError) {
    result = Error.ResourceNotFoundError(null, 'Invalid video id');
  }
  else if (error instanceof Error.errors.HttpError) {
    result = Error.InternalServerError(null, 'External http call error');
  }
  else {
    // Unknown errors
    result = Error.InternalServerError(null, 'Unexpected error');
  }

  return result;
}

module.exports = videoInfoController;
