var Error = require('../../../error');
var VideoServiceFormatHandler = require('../video_service_format_handler');

////////////////////////////////////////////////////////////////////////////////

var m3u8Handler = new VideoServiceFormatHandler('m3u8');
m3u8Handler.process = function(videoId, callback) {
  this.returnData({
    '&#x6807;&#x6E05;': '/player/getM3U8/vid/' + videoId + '/type/flv/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8',
    '&#x9AD8;&#x6E05;': '/player/getM3U8/vid/' + videoId + '/type/mp4/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8',
    '&#x8D85;&#x6E05;': '/player/getM3U8/vid/' + videoId + '/type/hd2/ts/' + (((new Date()).getTime()/1000).toString()|0) + '/v.m3u8'
  }, callback);
}

////////////////////////////////////////////////////////////////////////////////

var mp4Handler = new VideoServiceFormatHandler('mp4');

mp4Handler.getFileIDMixString = function(seed){
  var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(''),
    mixed = [],index;
  for (var i=0, len = source.length; i< len;i++){
    seed = (seed * 211 + 30031) % 65536;
    index = Math.floor(seed/65536 * source.length);
    mixed.push(source[index]);
  }
  return mixed.join('');
};

mp4Handler.getFileID = function(fileid, seed){
  var mixed = getFileIDMixString(seed), ids= fileid.split("*"), realId = [], idx;
  for (var i=0; i< ids.length; i++){
    idx = parseInt(ids[i],10);
    realId.push(mixed.charAt(idx));
  }
  return realId.join('');
}

mp4Handler.process = function(videoId, callback) {
  var url = 'http://v.youku.com/player/getPlaylist/VideoIDS/' + videoId + '/Pf/4?__callback=';
  this.getJSONPData(url, null, callback, function(data){
    try {
      var d    = new Date(),
        fileid = getFileID(data.data[0]['streamfileids']['3gphd'], data.data[0]['seed']),
        sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
        k      = data.data[0]['segs']['3gphd'][0]['k'],
        st     = data.data[0]['segs']['3gphd'][0]['seconds'];s
    }
    catch (error)  {
      callback(Error.InvalidContentError(error, 'Error occures while parsing [fileid,sid,k,st]', Error.errorBodyReqRes(url, data)));
      return;
    }

    var url2 = 'http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1&callback=';
    this.getJSONPData(url2, null, callback, function(data) {
      try {
        var result = data[0]['server'];
        if (!result) {
          throw Error.InvalidContentError(null, 'Result is null - param[0][\'server\']', Error.errorBodyReqRes(url2, data));
        }

        this.returnData({ '&#x9AD8;&#x6E05;': result }, callback);
      }
      catch (error) {
        callback(error);
      }
    });
  });
}

////////////////////////////////////////////////////////////////////////////////

module.exports = [m3u8Handler, mp4Handler];