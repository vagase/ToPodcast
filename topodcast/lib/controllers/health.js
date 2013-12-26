var Handler = require('./handler');

var healthController = new Handler();

healthController.process = function(req, res, next) {
  this.success(req, res, next, {"status" : "green"});
}

module.exports = healthController;
