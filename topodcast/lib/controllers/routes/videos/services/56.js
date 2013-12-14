var jsonp = require('../../../../helpers/jsonp');
var restify = require('restify');

module.exports = {
  mp4: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);

    var requestURL = 'http://vxml.56.com/ipad/'+ videoID +'/?src=site&callback=';

    jsonp(requestURL, function(error, param){
        if (error) {
          cba.error(error);
          return;
        }

        try {
          var urls = {};
          for(var i= param.df.length-1; i>=0; i--){
            urls[param.df[i]['type']] = param.df[i]['url'];
          }
        }
        catch (error) {
          error = new restify.InvalidContentError('Error occurs while parsing 56 jsonp response data. ' + error);
          logger.logRequestResponseError(requestURL, param, error);
          cba.error(error);
          return
        }

        cba.success(urls);
      },
      'jsonp_dfInfo'
    )
  }
}