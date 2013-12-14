var request = require('request');
var restify = require('restify');

module.exports = function(url, callback, handler) {
  var back = handler || 'cb_' + new Date().getTime() + Math.random().toString().replace('.','');

  var cba = new CallbackAdapter(callback);

  var requestURL = url + back;
  request(requestURL, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var reg = new RegExp('^\\s*' + back + '\\s*\\(\\s*(.*)\\s*\\)\\s*;?\\s*$');
      var matches = reg.exec(body);
      if (matches && matches.length >= 2) {
        var json, err;
        try {
          json = JSON.parse(matches[1]);
        }
        catch (e) {
          e = new restify.InvalidContentError('Response is invalid JSON format.' + e);
          logger.logRequestResponseError(requestURL, body, e);
          cba.error(e);
        }
        cba.success(json);
      }
      else {
        var e = new restify.InvalidContentError("No callback function found in repsone body.");
        logger.logRequestResponseError(requestURL, body, e);
        cba.error(e);
      }
    }
    else {
      var e = new restify.codeToHttpError(response.statusCode, error ? error.toString() : null);
      logger.logRequestResponseError(requestURL, body, e);
      cba.error(e);
    }
  });
}
