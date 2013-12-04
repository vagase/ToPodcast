Object.extend = function(target) {
  if (arguments.length < 2) {
    throw Error("extend: Too less arguments.");
  }

  for (var i = 1; i < arguments.length; ++i) {
    for (key in arguments[i]) {
      target[key] = arguments[i][key];
    }
  }
}
