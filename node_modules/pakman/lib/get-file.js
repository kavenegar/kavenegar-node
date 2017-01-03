(function (){
  "use strict";

  var fs = require('fs')
    ;

  function getFile(fullpath, fn) {

    function parseFileAsString(err, data) {
      fn(err, data && data.toString('utf8'));
    }

    fs.readFile(fullpath, parseFileAsString);
  }

  module.exports.getFile = getFile;
}());
