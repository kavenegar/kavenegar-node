#!/usr/bin/env node

// ./test-get-module-leaf.js ../test_modules/foomodule/ . ./test-local-deps
// ./test-get-module-leaf.js ../test_modules/foomodule/ . ./foo
// ./test-get-module-leaf.js ../test_modules/foomodule/ ./qux ./quux
// ./test-get-module-leaf.js ../test_modules/foomodule/ ./qux ../lib/corge
// ./test-get-module-leaf.js ../test_modules/foomodule/ ./lib ./corge
// TODO support lib dirs
// ./test-get-module-leaf.js ../test_modules/foomodule/ ./qux test-local-deps/corge

// ./test-get-module-leaf.js ../test_modules/foomodule/ . ./doesnt-exist
// ./test-get-module-leaf.js ../test_modules/foomodule/ . test-local-deps/also/doesnt-exist

(function () {
  "use strict";

  var fs = require('fs')
    , getModuleLeaf = require('../lib/get-module-leaf').getModuleLeaf
    , moduleRoot = process.argv[2]
    , prevPath = process.argv[3] || '.'
    , requireString = process.argv[4]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function log(err, pkg, prev, leaf) {
    console.log(pkg.name);
    console.log(prev);
    console.log(leaf);
    if (leaf.error) {
      console.error(leaf.error.message);
      console.error(leaf.error.stack);
    }
  }

  function onReadFile(err, pkg) {
    var prev = {}
      ;

    if (err) {
      console.error(err.message);
      console.error(err.stack);
      return;
    }

    try {
      pkg = JSON.parse(pkg.toString('utf8'));
    } catch(e) {
      console.error(err.message);
      console.error(err.stack);
      return;
    }

    pkg.moduleRoot = moduleRoot;
    prev.submodulePath = prevPath;
    prev.pathname = '.';

    getModuleLeaf(pkg, prev, requireString || pkg.main || './index', log);
  }

  fs.readFile(moduleRoot + '/' + 'package.json', onReadFile);
}());
