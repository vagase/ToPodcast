var restify = require('restify');

var createError = function(ErrorClass, internalError, message, body) {
  if (!ErrorClass) {
    throw new Error("ErrorClass MUST not be null.");
  }

  var context = message ? message : '';

  if (internalError) {
    context += '[' + internalError + ']';
  }

  if (body) {
    if (context) {
      context += ' - ';
    }

    context += body;
  }

  return new ErrorClass(context);
}

var InvalidArgumentError = function(message, body) {
  return createError(restify.InvalidArgumentError, null, message, body);
}

var InvalidContentError = function(internalError, message, body) {
  return createError(restify.InvalidContentError, internalError, message, body);
}

var HttpError = function(statusCode, internalError, message, body) {
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