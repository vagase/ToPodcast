var util = require('util');
var Handler = require('../handler');
var VideoService = require('../../services/video/service');

var VideoServiceInfoController = function () {};
util.inherits(VideoServiceInfoController, Handler);
module.exports = VideoServiceInfoController;

VideoServiceInfoController.prototype.process = function(req, res, next) {
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