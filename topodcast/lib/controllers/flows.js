exports.error = function(req, res, next, error) {
  logger.warn('request: ' + req.method + ' ' + req.url + ' ' + req.body + ' \nError: '  + error + error.stack, 2);
  next(error);
}

exports.success = function(req, res, next, data) {
  logger.debug('request: ' + req.method + ' ' + req.url + ' ' + req.body, 2);
  res.json(data);
  next();
}