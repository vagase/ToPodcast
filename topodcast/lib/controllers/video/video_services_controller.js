var util = require('util');
var Handler = require('../handler');
var VideoService = require('../../services/video/service');

var VideoServicesController = function() {};
util.inherits(VideoServicesController, Handler);
module.exports = VideoServicesController;

VideoServicesController.prototype.process = function(req, res, next) {
  this.success(req, res, next, {
    videoTypes: VideoService.getServicesName()
  });
}