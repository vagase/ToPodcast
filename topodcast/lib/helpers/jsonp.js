// TODO:
var request = require('request');

module.exports = function(url, callback, handler) {
  var back = handler || 'cb_' + new Date().getTime() + Math.random().toString().replace('.','');

  request(url+back, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var reg = new RegExp('^\\s*' + back + '\\s*\\(\\s*(.*)\\s*\\)\\s*;\\s*$');
      var matches = reg.exec(body);
      if (matches && matches.length >= 2) {
        callback(undefined, matches[1]);
      }
      else {
        callback(new Error("Invalid response body format"));
      }
    }
    else {
      callback(error || new Error("Response status code is: " + response.statusCode));
    }
  });
}
