/**
 * Writes an observable sequence to a stream
 * @param {Observable} observable Observable sequence to write to a stream.
 * @param {Stream} stream The stream to write to.
 * @param {String} [encoding] The encoding of the item to write.
 * @returns {Disposable} The subscription handle.
 */
exports.writeToStream = function (observable, stream, encoding) {
  var source = observable.pausableBuffered();

  function onDrain() {
    source.resume();
  }

  stream.addListener('drain', onDrain);

  var disposable = source.subscribe(
    function (x) {
      !stream.write(String(x), encoding) && source.pause();
    },
    function (err) {
      stream.emit('error', err);
    },
    function () {
      // Hack check because STDIO is not closable
      !stream._isStdio && stream.end();
      stream.removeListener('drain', onDrain);
    });

  source.resume();

  return disposable;
};
