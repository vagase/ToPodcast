var jsonp = require('../../../../helpers/jsonp');
var restify = require('restify');

var processFormat = function(format, videoID, callback) {
  var cba = new CallbackAdapter(callback);

  var requestURL;
  if (format === 'm3u8') {
    requestURL = 'http://zythum.sinaapp.com/youkuhtml5playerbookmark/sohu.php?vid=' + videoID + '&nid=' + videoID.nid + '&callback=';
  }
  else if (format === 'mp4') {
    requestURl = 'http://zythum.sinaapp.com/youkuhtml5playerbookmark/sohu.php?vid=' + videoID + '&nid=' + videoID.nid + '&callback=';
  }

  jsonp(requestURL, function(error, param) {
    if(error) {
      cba.error(error);
      return;
    }

    try {
      var url = param.urls.m3u8.filter(function(item){
        if(item){
          return item;
        }
      });

      var urls = { '&#x9AD8;&#x6E05;': url[0] };
    }
    catch (error) {
      error = new Restify.InvalidContentError("Error ocures while parsing sohu jsonp response data. " + error);
      logger.logErrorWithReqRes(requestURL, param, error);
      cba.error(error);
      return;
    }

    cba.success({'m3u8' : urls});

  }

module.exports = {
  m3u8: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);

    var requestURL = 'http://zythum.sinaapp.com/youkuhtml5playerbookmark/sohu.php?vid='+videoID+'&nid='+videoID.nid+'&callback=';
    jsonp(requestURL, function(error, param) {
      if(error) {
        cba.error(error);
        return;
      }

      try {
        var url = param.urls.m3u8.filter(function(item){
          if(item){
            return item;
          }
        });

        var urls = { '&#x9AD8;&#x6E05;': url[0] };
      }
      catch (error) {
        error = new Restify.InvalidContentError("Error ocures while parsing sohu jsonp response data. " + error);
        logger.logErrorWithReqRes(requestURL, param, error);
        cba.error(error);
        return;
      }

      cba.success({'m3u8' : urls});

    });
  },

  mp4: function(videoID, callback) {
    var cba = new CallbackAdapter(callback);
  }
}

'搜狐' && youkuhtml5playerbookmark2.add(function(core, canPlayM3U8){
	var vid = window.vid;
	var nid = window.nid;
	var m3u8 = function(callback){
		core.jsonp(
			'http://zythum.sinaapp.com/youkuhtml5playerbookmark/sohu.php?vid='+vid+'&nid='+nid+'&callback=',
			function(param){
				var url = param.urls.m3u8.filter(function(item){
					if(item){
						return item;
					}
				});
				callback( { '&#x9AD8;&#x6E05;': url[0] });
			}
		)
	};
	var mp4 = function(callback){
		core.jsonp(
			'http://zythum.sinaapp.com/youkuhtml5playerbookmark/sohu.php?vid='+vid+'&nid='+nid+'&callback=',
			function(param){
				var url = param.urls.mp4.filter(function(item){
					if(item){
						return item;
					}
				});
				callback( { '&#x9AD8;&#x6E05;': url[0] });
			}
		)
	};
	return{
		reg: /sohu\.com/.test(window.location.host) && vid,
		call: function(callback){
			return (canPlayM3U8 ? (m3u8||mp4) : mp4)(function(urls){
				return callback({ urls: urls, flashElementId: 'player' });
			});
		}
	}
});
