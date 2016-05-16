var {EventEmitter} = require('events');

exports.toEventEmitter = function (observable, eventName, selector) {
  var e = new EventEmitter();

  // Used to publish the events from the observable
  e.publish = function () {
    e.subscription = observable.subscribe(
      function (x) {
        var result = x;
        if (selector) {
          try {
            result = selector(x);
          } catch (e) {
            return e.emit('error', e);
          }
        }

        e.emit(eventName, result);
      },
      function (err) {
        e.emit('error', err);
      },
      function () {
        e.emit('end');
      });
  };

  return e;
};
