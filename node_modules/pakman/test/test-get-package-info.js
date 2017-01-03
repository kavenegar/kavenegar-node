#!/usr/bin/env node

// ./test-get-package-info.js ../test_modules/foomodule/
// ./test-get-package-info.js ../test_modules/doesnt-exist/

(function () {
  "use strict";

  var fs = require('fs')
    , getPackageInfo = require('../lib/get-package-info').getPackageInfo
    , moduleRoot = process.argv[2]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function log(err, pkg) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(pkg.name);
    console.log(pkg);
  }

  getPackageInfo(moduleRoot, log);
}());
