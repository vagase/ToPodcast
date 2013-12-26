var request = require('request');
var Error = require('../error');

module.exports = function(url, callback, handler) {
  var back = handler || 'cb_' + new Date().getTime() + Math.random().toString().replace('.','');

  var url = url + back;
  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var reg = new RegExp('^\\s*' + back + '\\s*\\(\\s*(.*)\\s*\\)\\s*;?\\s*$');
      var matches = reg.exec(body);
      if (matches && matches.length >= 2) {
        var json, err;
        try {
          json = JSON.parse(matches[1]);
        }
        catch (e) {
          callback(Error.InvalidContentError(e, 'Response is invalid JSON format', Error.errorBodyReqRes(url, body)));
        }

        callback(null, json);
      }
      else {
        callback(Error.InvalidContentError(null, 'No callback function found in repsone body', Error.errorBodyReqRes(url, body)));
      }
    }
    else {
      callback(Error.HttpError(response.statusCode, error, 'jsonp external http error', Error.errorBodyReqRes(url, body)));
    }
  });
}
