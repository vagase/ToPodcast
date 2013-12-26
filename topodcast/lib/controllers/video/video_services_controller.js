var Handler = require('../handler');
var VideoService = require('../../services/video/video_service');

var videoServiceController = new Handler();

videoServiceController.process = function(req, res, next) {
  this.success(req, res, next, {
    videoTypes: VideoService.getServicesName()
  });
}

module.exports = videoServiceController;