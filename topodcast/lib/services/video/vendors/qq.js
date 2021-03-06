var Error = require('../../../error');
var VideoServiceFormatHandler = require('../video_service_format_handler');

var mp4Handler = new VideoServiceFormatHandler('mp4');

mp4Handler.process = function(videoId, callback) {
  var url = 'http://vv.video.qq.com/geturl?otype=json&vid='+ videoId +'&charge=0&callbacks';
  this.getJSONPData(url, null, callback, function(data) {
    try{
      var urls = { '&#x9AD8;&#x6E05;': param.vd.vi[0].url};
      this.returnData(urls, callback);
    }
    catch(error) {
      callback(Error.InvalidContentError(error, 'Error ocures while parsing qq jsnp response data', Error.errorBodyReqRes(url, data)));
    }
  });
}

module.exports = [mp4Handler];