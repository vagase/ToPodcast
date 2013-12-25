var index = require("./controllers/index");
var health = require("./controllers/health");
var apiVideos = require("./controllers/video");

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
  // api - video
  {
    method : "GET",
    path : "/video",
    handlers : apiVideos
  },
  {
    method : "GET",
    path : "/video/:service",
    handlers : apiVideos.service
  },
  {
    method : "GET",
    path : "/video/:service/:videoId",
    handlers : apiVideos.service.videoID
  }
];