#!/usr/bin/env node
(function () {
  "use strict";

  var getFile = require('../lib/get-file').getFile
    , getRequires = require('../lib/get-requires').getRequires
    , fullpath = process.argv[2]
    ;

  if (!fullpath) {
    console.log('Must give a full path such as \'./test_modules/foomodule/foo.js\'');
    return;
  }

  function log(err, str) {
    var requires;

    if (err) {
      console.error(err);
      return;
    }
    
    requires = getRequires(str);
    console.log(requires);
  }

  getFile(fullpath, log);
}());
