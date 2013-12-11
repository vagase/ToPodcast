exports.error = function(req, res, next, error) {
  req.log.warn(error);
  logger.warn('request: ' + req.method + ' ' + req.url + ' ' + req.body + ' | Error: '  + error);
  next(error);
}

exports.success = function(req, res, next, data) {
  res.json(data);
  next();
}