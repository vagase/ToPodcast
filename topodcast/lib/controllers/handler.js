var Error = require('../error');

var Handler = function() {
}

Handler.prototype.execute = function(req, res, next) {
  try{
    this.process(req, res, next);
  }
  catch (error) {
    error = Error.InternalServerError(error, 'Unexpected error');
    logger.logErrorWithReqRes(error, req.getId());
    next(error);

  }
}

Handler.prototype.success = function(req, res, next, data) {
  res.json(data);
  next();
}

Handler.prototype.error = function(req, res, next, error) {
  logger.logErrorWithReqRes(error, req.getId());
  next(this.processError(error));
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