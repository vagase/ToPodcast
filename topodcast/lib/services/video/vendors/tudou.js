var restify = require('restify');
var VideoServiceFormatHandler = require('../video_service_format_handler');

var m3u8Handler = new VideoServiceFormatHandler('m3u8');

m3u8Handler.process = function(videoId, callback) {
  this.returnData({
    '&#x6807;&#x6E05;': 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + videoId + '&st=2',
    '&#x539F;&#x753B;': 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + videoId + '&st=5'
  }, callback);
};

////////////////////////////////////////////////////////////////////////////////

var mp4Handler = new VideoServiceFormatHandler('mp4');

mp4Handler.process = function(videoId, callback) {
  var url = 'http://vr.tudou.com/v2proxy/v2.js?it=' + videoId + '&st=52%2C53%2C54&pw=&jsonp';
  this.getJSONPData(url, null, callback, function(data) {
    try {
      if(data.code == -1) {
        throw new Error('Param code is -1.');
      }

      var urls = {};
      for(var i=0,len=data.urls.length; i<len; i++){
        urls[i] = data.urls[i];
      }

      this.returnData(urls, callback);
    }
    catch (error) {
      callback(new restify.InvalidContentError('Error occures while parsing tudou jsonp response data. ' + error));
    }
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports = [m3u8Handler, mp4Handler];