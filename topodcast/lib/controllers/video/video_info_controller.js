var Handler = require('../handler');
var VideoService = require('../../services/video/video_service');

var videoInfoController= new Handler();

videoInfoController.process = function (req, res, next) {
  try {
    var service = VideoService.getServiceWithName(req.params.service);
    service.getVideoInfo(req.params.videoId, req.params.format, function(error, videoInfo){
      if (error)  {
        this.error(req, res, next, error);
      }
      else {
        this.success(req, res, next, videoInfo);
      }
    });
  }
  catch (error) {
    this.error(req, res, next, error);
  }
}

videoInfoController.processError = function(error) {
  var result;

  if (error instanceof restify.InvalidArgumentError) {
    result = error;
  }
  else if (error instanceof restify.InvalidContentError) {
    result = new restify.ResourceNotFoundError('Invalid video id');
  }
  else if (error instanceof restify.HttpError) {
    result = new restify.InternalError('External http call error');
  }
  else {
    // Unknown errors
    result = new restify.InternalError('Internal server error');
  }

  return result;
}

module.exports = videoInfoController;
