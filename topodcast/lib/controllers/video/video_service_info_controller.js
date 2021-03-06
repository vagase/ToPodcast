var Handler = require('../handler');
var VideoService = require('../../services/video/video_service');

var videoServiceInfoController= new Handler();

videoServiceInfoController.process = function(req, res, next) {
  try {
    var service = VideoService.getServiceWithName(req.params.service);

    this.success(req, res, next, {
      supportedTypes: service.getSupportedFormats()
    });
  }
  catch (error) {
    this.error(req, res, next, error);
  }
}

module.exports = videoServiceInfoController;