/**
 *  Callback management
 */

function CallbackAdapter(callback, logger) {
// TODO:  this.logger = (typeof logger === 'undefined') ? defaultLogger : logger;
  this.logger = logger;

  this.success = function(data, printLog) {
    if (printLog) {
      this.logger.info(data);
    }
    callback(null, data);
  }

  this.error = function(error, printLog) {
    if (printLog) {
      this.logger.warn(error);
    }

    callback(error);
  }
}

exports.CallbackAdapter = CallbackAdapter;