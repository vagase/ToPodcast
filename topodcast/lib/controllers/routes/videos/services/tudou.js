var jsonp = require('../../../../helpers/jsonp');
var restify = require('restify');

module.exports = {
  m3u8: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);
    cba.success({'m3u8' :{
      '&#x6807;&#x6E05;': 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + videoID + '&st=2',
      '&#x539F;&#x753B;': 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + videoID + '&st=5'
    } });
  },

  mp4: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);

    var requestURL = 'http://vr.tudou.com/v2proxy/v2.js?it=' + videoID + '&st=52%2C53%2C54&pw=&jsonp';
    jsonp(requestURL, function(error, param) {
      if (error) {
        cba.error(error);
        return;
      }

      try {
        if(param.code == -1) {
          throw new Error('Param code is -1.');
        }

        var urls = {};

        for(var i=0,len=param.urls.length; i<len; i++){
          urls[i] = param.urls[i];
        }
      }
      catch (error) {
        error = new restify.InvalidContentError('Error occures while parsing tudou jsonp response data. ' + error);
        logger.logRequestResponseError(requestURL, param, error);
        cba.error(error);
        return;
      }

      cba.success({'mp4' : urls});
    });
  }
}