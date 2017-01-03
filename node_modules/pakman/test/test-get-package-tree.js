#!/usr/bin/env node

// ./test-get-package-tree.js ../test_modules/foomodule/
// ./test-get-package-tree.js ../test_modules/doesnt-exist/

(function () {
  "use strict";

  var getPackageTree = require('../lib/get-package-tree').getPackageTree
    , moduleRoot = process.argv[2]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function log(err, pkg, tree) {
    if (err) {
      console.error(err);
      return;
    }

    //console.log(Object.keys(tree));
    //console.log(JSON.stringify(tree, null, '  '));
    console.log(tree);
  }

  getPackageTree(moduleRoot, log);
}());
