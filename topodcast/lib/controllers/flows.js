exports.error = function(req, res, next, error) {
  next(error);
  next();
}

exports.success = function(req, res, next, data) {
  res.json(data);
  next();
}