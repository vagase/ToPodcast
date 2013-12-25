var jsonp = require('../../../../helpers/jsonp');
var restify = require('restify');

module.exports = {
 mp4: function(videoID, callback) {
   var cba = new CallbackAdapter(callback);

   var requestURL = 'http://vv.video.qq.com/geturl?otype=json&vid='+ videoID +'&charge=0&callbacks';
   jsonp(requestURL, function(error, param) {
     if (error) {
       cba.error(error);
       return;
     }

     try{
       var urls = { '&#x9AD8;&#x6E05;': param.vd.vi[0].url};
       }
     catch(error) {
       error = new restify.InvalidContentError("Error ocures while parsing qq jsnp response data. " + error);
       logger.logRequestResponseError(requestURL, param, error);
       cba.error(error);
       return;
     }

     cba.success({'mp4': urls});
   });
  }
}