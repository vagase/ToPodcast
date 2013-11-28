module.exports = function(req, res) {
  res.set("Content-Type", 'application/json');
  res.send({"status" : "green"});
}