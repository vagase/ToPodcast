var request = require('request');
var restify = require('restify');

module.exports = function(url, callback, handler) {
  var back = handler || 'cb_' + new Date().getTime() + Math.random().toString().replace('.','');

  var cba = new CallbackAdapter(callback);

  request(url+back, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var reg = new RegExp('^\\s*' + back + '\\s*\\(\\s*(.*)\\s*\\)\\s*;?\\s*$');
      var matches = reg.exec(body);
      if (matches && matches.length >= 2) {
        var json, err;
        try {
          json = JSON.parse(matches[1]);
        }
        catch (e) {
          cba.error(new restify.InvalidContentError("Invalid JSON format"));
        }
        cba.success(json);
      }
      else {
        cba.error(new restify.InvalidContentError("No callback function found in repsone body"));
      }
    }
    else {
      cba.error(restify.codeToHttpError(response.statusCode, error ? error.toString() : null));
    }
  });
}
