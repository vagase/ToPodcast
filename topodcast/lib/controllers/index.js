var Handler = require('./handler');

var indexController = new Handler();

indexController.process = function(req, res, next) {
  this.success(req, res, next, 'TODO: Show apis with swagger.');
}

module.exports = indexController;
