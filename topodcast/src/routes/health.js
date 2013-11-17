exports.health = function(req, res) {
  res.set("Content-Type", 'application/json');
  res.send({"health" : "green"});
}