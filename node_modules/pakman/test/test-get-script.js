#!/usr/bin/env node
// ./test-get-script.js ../test_modules/foomodule/ foo.js
// ./test-get-script.js ../test_modules/foomodule/ foo
// ./test-get-script.js ../test_modules/foomodule/ qux/quux.js
// ./test-get-script.js ../test_modules/foomodule/ qux/quux
// ./test-get-script.js ../test_modules/foomodule/ qux
// ./test-get-script.js ../test_modules/foomodule/ lib/corge.js
(function () {
  "use strict";

  var fs = require('fs')
    , getScript = require('../lib/get-script').getScript
    , moduleRoot = process.argv[2]
    , filepath = process.argv[3]
    ;

  if (!moduleRoot || !filepath) {
    console.log('must give a module path and module-relative and file name path such as \'./test_modules/foomodule ./foo.js\'')
    return;
  }

  function log(err, dir, file, src) {
    if (err) {
      console.error(err);
      return;
    }

    console.log('[DIR]', dir);
    console.log('[FILE]', file);
    console.log('[SRC]', src);
  }

  function onReadFile(err, pkg) {
    if (err) {
      console.error(err);
      return;
    }

    try {
      pkg = JSON.parse(pkg.toString('utf8'));
    } catch(e) {
      console.error(err);
      return;
    }

    pkg.moduleRoot = moduleRoot;

    getScript(pkg, filepath, log);
  }

  fs.readFile(moduleRoot + '/' + 'package.json', onReadFile);
}());
