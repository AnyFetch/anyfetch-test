"use strict";

/**
 * Repeatedly call `checker` function with `done` and `tryAgain` function.
 * Checker can ask to be called again at a later time by calling `tryAgain()` instead of `done()`
 */
module.exports.wait = function loopUntil(checker, interval) {
  var previousError;

  var tryAgain = function(err) {
    if(err && process.env.VERBOSE) {
      var errString = err.toString();
      if(previousError !== errString) {
        previousError = errString;
        console.warn("\x1b[0mwarn:\x1b[0m", errString);
      }
    }

    var timer = setTimeout(function() {
      checker(tryAgain);
    }, interval || 500);
    timer.unref();
  };

  checker(tryAgain);
};
