var jsonp = require('../../helpers/jsonp');
VideoServiceFormatHandler = function(format) {
  this.format = format;
}

VideoServiceFormatHandler.prototype.returnData = function(data, callback) {
  var dataWrapper = {};
  dataWrapper[this.format] = data;
  callback(null, dataWrapper);
}

VideoServiceFormatHandler.prototype.getJSONPData = function(url, handler, errorCallback, successCallback) {
  jsonp(url, function(error, data){
    if (error) {
      errorCallback(error);
    }
    else {
      successCallback(data);
    }
  }, handler);
}

/**
 * @Override
 * @param videoId
 * @param callback
 */
VideoServiceFormatHandler.prototype.process = function(videoId, callback) {
  // Do nothing
}

module.exports = VideoServiceFormatHandler;