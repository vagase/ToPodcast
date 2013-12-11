var index = require("./controllers/routes/index");
var health = require("./controllers/routes/health");
var apiVideos = require("./controllers/routes/videos");

exports.routeRules = [
  {
    method : "GET",
    path : "/",
    handlers : index
  },
  {
    method : "GET",
    path : "/health",
    handlers : health
  },

  //////////////////////////////////////////////////////////////////////////////
  // api - videos
  {
    method : "GET",
    path : "/videos",
    handlers : apiVideos
  },
  {
    method : "GET",
    path : "/videos/:service",
    handlers : apiVideos.service
  },
  {
    method : "GET",
    path : "/videos/:service/:videoId",
    handlers : apiVideos.service.videoID
  }
];