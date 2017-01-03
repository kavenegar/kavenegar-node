#!/usr/bin/env node

// ./test-reduce-tree.js ../test_modules/foomodule/
// ./test-reduce-tree.js ../test_modules/doesnt-exist/

(function () {
  "use strict";

  var getPackageTree = require('../lib/get-package-tree').getPackageTree
    , reduceTree = require('../lib/reduce-tree').reduceTree
    , moduleRoot = process.argv[2]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function reduce(err, pkg, tree) {
    var list
      ;

    //console.log(tree && 'heya');
    list = reduceTree(tree)

    console.log(list);
  }

  getPackageTree(moduleRoot, reduce);
}());
