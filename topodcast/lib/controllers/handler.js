var restify = require('restify');

var Handler = function() {
}

Handler.prototype.execute = function(req, res, next) {
  try{
    this.process(req, res, next);
  }
  catch (error) {
    logger.logRequestResponseError("Unexpceted error: " + error);
    next(new restify.InternalError('Internal server error'));
  }
}

Handler.prototype.success = function(req, res, next, data) {
  res.json(data);
  next();
}

Handler.prototype.error = function(req, res, next, error) {
  next(Handler.error.processError(error));
}

/**
 * @Override
 * @param error
 * @returns {*}
 *
 * Input internal error and return error to reponse.
 */
Handler.prototype.processError = function (error) {
  return error;
}

/**
 * @Override
 * @param req
 * @param res
 * @param next
 */
Handler.prototype.process = function(req, res, next) {
  // Default do nothing.
}

module.exports = Handler;