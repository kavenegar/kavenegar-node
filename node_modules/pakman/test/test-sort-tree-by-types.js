#!/usr/bin/env node

// ./test-sort-tree-by-types.js ../test_modules/foomodule/
// ./test-sort-tree-by-types.js ../test_modules/doesnt-exist/

(function () {
  "use strict";

  var getPackageTree = require('../lib/get-package-tree').getPackageTree
    , sortTreeByTypes = require('../lib/sort-tree-by-types').sortTreeByTypes
    , moduleRoot = process.argv[2]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function log(err, missing, builtin, local, pm) {
    if (err) {
      console.error(err);
      return;
    }

    //list = reduceTree(tree, log)
    //console.log(local);
    console.log(Object.keys(local));
  }

  function sortTree(err, pkg, tree) {
    sortTreeByTypes(tree, log)
  }

  getPackageTree(moduleRoot, sortTree);
}());
