var index = require("./controllers/routes/index");
var health = require("./controllers/routes/health");
var apiVideos = require("./controllers/routes/api/videos");

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
    path : "/api/videos",
    handlers : apiVideos
  },
  {
    method : "GET",
    path : "/api/videos/:service",
    handlers : apiVideos.service
  },
  {
    method : "GET",
    path : "/api/videos/:service/:videoId",
    handlers : apiVideos.service.videoID
  }
];