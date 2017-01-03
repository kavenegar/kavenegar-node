#!/usr/bin/env node

// ./test-get-module-tree.js ../test_modules/foomodule/
// ./test-get-module-tree.js ../test_modules/doesnt-exist/

(function () {
  "use strict";

  var getPackageInfo = require('../lib/get-package-info').getPackageInfo
    , getModuleTree = require('../lib/get-module-tree').getModuleTree
    , moduleRoot = process.argv[2]
    ;

  if (!moduleRoot) {
    console.log('must give a module root such as \'./test_modules/foomodule\'')
    return;
  }

  function log(err, tree) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(JSON.stringify(tree, null, '  '));
  }

  function wrapPackageRoot(err, meta) {
    var leaf = {}
      ;

    if (err) {
      console.error(err);
      return;
    }

    // TODO treat main as require list
    leaf.name = meta.main || 'index';
    leaf.pathname = '.'; 
    leaf.require = './' + meta.name;
    leaf.modulepath = meta.name;
    //sub.pathname = '.';

    //console.log(meta);

    getModuleTree(meta, leaf, leaf.require, log);
  }

  getPackageInfo(moduleRoot, wrapPackageRoot);
}());
