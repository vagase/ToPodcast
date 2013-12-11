var jsonp = require('../../../../../helpers/jsonp');

module.exports = {
  mp4: function(videoID, callback) {

    /**
    * Sample return:
    * jsonp_dfInfo({"msg":"ok","df":[{"url":"http://f3.r.56.com/f3.c122.56.com/flvdownload/19/25/138448746366hd.flv.mp4?v=1&t=rFQdCo4tlHTUUQBdiny4fg&r=33845&e=1386419667&tt=43&sz=1673648&vid=100633793","type":"qvga"},{"url":"http://f3.r.56.com/f3.c122.56.com/flvdownload/19/25/138448746366hd_clear.flv.mp4?v=1&t=u2ZGfFfMHXAyw_Ir-TD93w&r=33845&e=1386419667&tt=43&sz=3031978&vid=100633793","type":"vga"}],"status":"1"});
    */
    jsonp(
      'http://vxml.56.com/ipad/'+ videoID +'/?src=site&callback=',
      function(error, body){
        try {
          var param = JSON.parse(body);

          if (param.msg === 'ok') {
            var urls = {};
            for(var tmp in param.df){
              urls[tmp['type']] = tmp['url'];
            }

            if (Object.keys(urls).length === 0) {
              throw Error("");
            }

          }
          else {

          }

        }
        catch (e) {

        }



        callback(urls);
        window[back] = backup;
      },
      'jsonp_dfInfo'
    )
  }
}

'56' && youkuhtml5playerbookmark2.add(function(core, canPlayM3U8){
	var page = window._page_;
	var mp4 = function(callback){		
		if(page.channel == 'view'){
			var vid  = location.href.match(/v\_([0-9a-zA-Z]+)\.html/);
			if(vid){
				vid = vid[1];
				callback({'&#x9AD8;&#x6E05;': 'http://vxml.56.com/m3u8/'+vid+'/'});
			}
		}else{
			var back = 'jsonp_dfInfo';
			var backup = window[back];
			core.jsonp(
				'http://vxml.56.com/ipad/'+(window.oFlv.o.id || window._oFlv_c.id)+'/?src=site&callback=',
				function(param){
					urlList = param.df;
					var urls = {};
					for(var i=param.df.length-1;i>=0;i--){
						urls[param.df[i]['type']] = param.df[i]['url'];
					}
					callback(urls);
					window[back] = backup;
				},
				back
			)
		}
	};
	return{
		reg: /56\.com/.test(window.location.host) && page,
		call: function(callback){			
			return mp4(function(urls){
				return callback({ urls: urls, flashElementId: 'mod_player' });
			});
		}
	}
});
