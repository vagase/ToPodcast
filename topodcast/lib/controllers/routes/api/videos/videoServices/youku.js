var request = require('request');
var jsonp = require('../../../../../helpers/jsonp');

module.exports = {
  m3u8: function(videoID, callback) {
    callback(undefined, {
      "m3u8" : {
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

//    request('http://v.youku.com/player/getPlaylist/VideoIDS/' + videoID + '/Pf/4', function(err, res, param){
//      if (!err && res.statusCode == 200) {
//        if (!param.data || param.data.length == 0) {
//          callback(new Error("Invalid video id"), null);
//        }
//        else {
//          var d      = new Date(),
//            fileid = getFileID(param.data[0]['streamfileids']['3gphd'], param.data[0]['seed']),
//            sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
//            k      = param.data[0]['segs']['3gphd'][0]['k'],
//            st     = param.data[0]['segs']['3gphd'][0]['seconds'];
//
//          request('http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1', function(err, res, param){
//            if (!err && res.statusCode == 200) {
//              if ( param.length != 0 ) {
//                callback(null, { "mp4": { '&#x9AD8;&#x6E05;': param[0]['server'] }});
//              }
//              else {
//                callback(new Error("Invalid video id"), null);
//              }
//            }
//            else {
//              callback(new Error(err.toString()), null);
//            }
//          });
//        }
//      }
//      else {
//        throw new Error(err.toString());
//      }
//    });

    jsonp('http://v.youku.com/player/getPlaylist/VideoIDS/' + videoID + '/Pf/4?callback=', function(error, param){
      if (!error) {
        if (!param.data || param.data.length == 0) {
          callback(new Error("Invalid video id"));
        }
        else {
          var d      = new Date(),
            fileid = getFileID(param.data[0]['streamfileids']['3gphd'], param.data[0]['seed']),
            sid    = d.getTime() + "" + (1E3 + d.getMilliseconds()) + "" + (parseInt(Math.random() * 9E3)),
            k      = param.data[0]['segs']['3gphd'][0]['k'],
            st     = param.data[0]['segs']['3gphd'][0]['seconds'];

          jsonp('http://f.youku.com/player/getFlvPath/sid/'+sid+'_00/st/mp4/fileid/'+fileid+'?K='+k+'&hd=1&myp=0&ts=1156&ypp=0&ymovie=1&callback=', function(error, param){
            if (!error) {
              if ( param.length != 0 ) {
                callback(undefined, { "mp4": { '&#x9AD8;&#x6E05;': param[0]['server'] }});
              }
              else {
                callback(new Error("Invalid video id"));
              }
            }
            else {
              callback(error);
            }
          })
        }
      }
      else {
        callback(error);
      }
    });

  }
}