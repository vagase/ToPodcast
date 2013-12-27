var DEFAULT_DEPTH = 20;

////////////////////////////////////////////////////////////////////////////////

Object.extend = function(target) {
  if (arguments.length < 2) {
    throw Error("Too less arguments");
  }

  for (var i = 1; i < arguments.length; ++i) {
    for (key in arguments[i]) {
      target[key] = arguments[i][key];
    }
  }
}

Object.deepClone = function(obj, depth) {
  if (typeof obj === 'undefined') {
    throw Error("To be cloned must be valid object");
  }

  if (typeof depth === 'undefined') {
    depth = DEFAULT_DEPTH;
  }

  if (depth < 0) {
    return {};
  }

  var copy = Array.isArray(obj) ? [] : {};

  for (var p in obj) {
    if (typeof obj[p] === 'object') {
      copy[p] = Object.deepClone(obj[p], depth - 1);
    }
    else {
      copy[p] = obj[p];
    }
  }

  return copy;
}

var _isObject = function(obj) {
  return (obj !== null) && (typeof obj == 'object') && !(Array.isArray(obj));
};

Object.deepExtend = function(target) {
  if (arguments.length < 2) {
    throw Error('Too less arguments');
  }

  var vargs = Array.prototype.slice.call(arguments, 1);
  var depth = vargs.pop();
  if (typeof depth !== 'number') {
    vargs.push(depth);
    depth = DEFAULT_DEPTH;
  }

  if (depth < 0) {
    return;
  }

  vargs.forEach(function(source) {
    for (var p in source) {

      if (_isObject(target[p]) && _isObject(source[p])){
        Object.deepExtend(target[p], source[p], depth - 1);
      }

      else if (source[p] && typeof source[p] === 'object') {
        target[p] = Object.deepClone(source[p]);
      }

      else {
        target[p] = source[p];
      }

    }
  });
}

String.prototype.nthIndexOf = function(substr, nth) {
  var i = -1;
  while(nth--) {
    i = this.indexOf(substr, i+1);

    if (i == -1) {
      break;
    }
  }

  return i;
}