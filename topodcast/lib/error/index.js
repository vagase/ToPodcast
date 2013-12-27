var restify = require('restify');

var createError = function(ErrorClass, internalError, message, body) {
  if (!ErrorClass) {
    throw new Error("ErrorClass MUST not be null.");
  }

  var context = message ? message : '';

  if (body) {
    if (context) {
      context += ' - ';
    }

    context += body;
  }

  var result = new ErrorClass(context);

  if (internalError) {
    result.stack = result.name + ": " + result.message + '\n' + internalError.stack;
  }
  else {
    var stack = result.stack;
    result.stack = result.name + ": " + result.message + '\n' + stack.substr(stack.nthIndexOf('\n', 3) + 1);
  }

  return result;
}

var InvalidArgumentError = function(message, body) {
  return createError(restify.InvalidArgumentError, null, message, body);
}

var InvalidContentError = function(internalError, message, body) {
  return createError(restify.InvalidContentError, internalError, message, body);
}

var HttpError = function(internalError, statusCode, message, body) {
  return restify.codeToHttpError(statusCode, message, body)
}

var InternalServerError = function(internalError, message, body) {
  return createError(restify.InternalError, internalError, message, body);
}

var ResourceNotFoundError = function(internalError, message, body) {
  return createError(restify.ResourceNotFoundError, internalError, message, body);
}

var errorBodyReqRes = function(request, response) {
  var result = '';

  if (request) {
    result +='Request: ' + JSON.stringify(request);
  }
  if (response) {
    if (result) {
      result += ' ';
    }
    result +='Response: ' + JSON.stringify(response);
  }

  return result;
}

exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidContentError = InvalidContentError;
exports.HttpError = HttpError;
exports.InternalServerError = InternalServerError;
exports.ResourceNotFoundError = ResourceNotFoundError;

exports.errors = restify.errors;

exports.errorBodyReqRes = errorBodyReqRes;