//var jsonp = require('../../helpers/jsonp');
//var restify = require('restify');
var services = require("./vendors");
var CallbackAdapter = require('../../helpers/callback').CallbackAdapter;

var Service = function(name, format, callback) {
  this.name = name;
  this.cba = new CallbackAdapter(callback);
}

////////////////////////////////////////////////////////////////////////////////

Service.getServicesName = function() {
  return Object.keys(services);
}

Service.getServiceWithName = function(name) {
  var service = services[name];
  if (service) {
    return service;
  }
  else {
    var error = new InvalidArgumentError("Unsupported video service");
    logger.logRequestResponseError(req.url, null, error);
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////
//

/*
 *@Override
 */
Service.prototype.getSupportedFormats = function () {
  return null
}

//Service.prototype. = var function(handler) {
//  this.cba.success(handler());
//};
//
//Service.prototype. = var function(, format) {
//
//};

module.exports = Service;