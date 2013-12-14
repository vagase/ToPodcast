var jsonp = require('../../../../helpers/jsonp');
var restify = require('restify');

module.exports = {
  m3u8: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);
    cba.success({ 'm3u8' : {
        '&#x6807;&#x6E05;': '/player/getM3U8/vid/' + videoID + '/type/flv/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8',
        '&#x9AD8;&#x6E05;': '/player/getM3U8/vid/' + videoID + '/type/mp4/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8',
        '&#x8D85;&#x6E05;': '/player/getM3U8/vid/' + videoID + '/type/hd2/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8'
      }
    });
  },

  mp4: function(videoID, callback) {
    function getFileIDMixString(seed){
      var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(''),
        mixed = [],index;
      for (var i=0, len = source.length; i< len;i++){
        seed = (seed * 211 + 30031) % 65536;
        index = Math.floor(seed/65536 * source.length);
        mixed.push(source[index]);
      }
      return mixed.join('');
    };

    function getFileID(fileid, seed){
      var mixed = getFileIDMixString(seed), ids= fileid.split("*"), realId = [], idx;
      for (var i=0; i< ids.length; i++){
        idx = parseInt(ids[i],10);
        realId.push(mixed.charAt(idx));
      }
      return realId.join('');
    }

    var cba = new CallbackAdapter(callback);

    var requestURL = 'http://v.youku.com/player/getPlaylist/VideoIDS/' + videoID + '/Pf/4?__callback=';
    jsonp(requestURL, function(error, param){

      if (error) {
        cba.error(error);
        return;
      }

      try {
        var d    = new Date(),
          fileid = getFileID(param.data[0]['streamfileids']['3gphd'], param.data[0]['seed']),
          sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
          k      = param.data[0]['segs']['3gphd'][0]['k'],
          st     = param.data[0]['segs']['3gphd'][0]['seconds'];s
      }
      catch (error)  {
        var error = new restify.InvalidContentError("Error occures while parsing [fileid,sid,k,st]. " + error);
        logger.logRequestResponseError(requestURL, param, error);
        cba.error(error);
        return;
      }

      requestURL = 'http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1&callback=';
      jsonp(requestURL, function(error, param){
        if (error) {
          cba.error(error);
          return;
        }

        try {
          var result = param[0]['server'];
          if (!result) {
            throw new restify.InvalidContentError('Result is null - param[0][\'server\']');
          }
        }
        catch (error) {
          error = new restify.InvalidContentError(error);
          logger.logRequestResponseError(requestURL, param, error);
          cba.error(error);
          return;
        }

        cba.success({ "mp4": { '&#x9AD8;&#x6E05;': result }});
      });
    });
  }
}