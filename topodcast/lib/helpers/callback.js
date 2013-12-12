/**
 *  Callback management
 */

function CallbackAdapter(callback) {

  this.success = function(data, printLog) {
    if (printLog) {
      logger.info(data, 2);
    }
    callback(null, data);
  }

  this.error = function(error, printLog) {
    if (printLog) {
      logger.warn(error, 2);
    }

    callback(error);
  }
}

exports.CallbackAdapter = CallbackAdapter;