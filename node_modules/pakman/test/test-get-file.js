#!/usr/bin/env node
(function () {
  "use strict";

  var getFile = require('../lib/get-file').getFile
    , fullpath = process.argv[2]
    ;

  if (!fullpath) {
    console.log('Must give a full path such as \'./test_modules/foomodule/foo.js\'');
    return;
  }

  function log(err, str) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(str);
  }

  getFile(fullpath, log);
}());
