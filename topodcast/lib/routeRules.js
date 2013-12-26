module.exports = [
  {
    method : "GET",
    path : "/",
    controller : require("./controllers/index")
  },
  {
    method : "GET",
    path : "/health",
    controller : require("./controllers/health")
  },

  //////////////////////////////////////////////////////////////////////////////
  // api - video
  {
    method : "GET",
    path : "/video",
    controller : require("./controllers/video/video_services_controller")
  },
  {
    method : "GET",
    path : "/video/:service",
    controller : require("./controllers/video/video_service_info_controller")
  },
  {
    method : "GET",
    path : "/video/:service/:videoId",
    controller : require("./controllers/video/video_info_controller")
  }
];