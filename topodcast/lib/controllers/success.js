module.exports = function(req, res, next, data) {
  res.json(data);
  next();
}