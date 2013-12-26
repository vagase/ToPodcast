var restify = require('restify');
var VideoServiceFormatHandler = require('../video_service_format_handler');

var mp4Handler = new VideoServiceFormatHandler('mp4');

mp4Handler.process = function(videoId, callback) {
  var url = 'http://vxml.56.com/ipad/'+ videoId +'/?src=site&callback=';
  this.getJSONPData(url, 'jsonp_dfInfo', callback, function(data) {
    try {
      var urls = {};
      for(var i= data.df.length-1; i>=0; i--){
        urls[data.df[i]['type']] = data.df[i]['url'];
      }

      this.returnData(urls, callback);
    }
    catch (error) {
      callback(new restify.InvalidContentError('Error occurs while parsing 56 jsonp response data. ' + error));
    }
  });
};

module.exports = [mp4Handler];