module.exports = function(req, res, next, error) {
  next(new Error(error));
}