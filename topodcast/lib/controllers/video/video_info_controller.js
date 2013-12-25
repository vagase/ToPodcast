var util = require('util');
var Handler = require('../handler');
var VideoService = require('../../services/video/service');

var VideoInfoController = function () {};
util.inherits(VideoInfoController, Handler);
module.exports = VideoInfoController;

VideoInfoController.prototype.process = function(req, res, next) {
  // TODO:
}