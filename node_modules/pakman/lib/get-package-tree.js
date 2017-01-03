/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var fs = require('fs')
    , getPackageInfo = require('../lib/get-package-info').getPackageInfo
    , getModuleTree = require('./get-module-tree').getModuleTree
    ;

  function getPackageTree(moduleRoot, fn) {
    getPackageInfo(moduleRoot, function (err, pkg) {
      var leaf = {}
        , paths
        ;   

      if (err) {
        fn(err);
        return;
      }

      paths = pkg.main.split('/');

      // the index / main is a special case that must
      // be set up appropriately
      leaf.name = pkg.name;
      leaf.filename = paths.pop();
      leaf.pathname = paths.join('/');
      leaf.filepath = pkg.main; 
      leaf.require = pkg.name;
      leaf.modulepath = pkg.name;

      // easiest just to let an error happen rather than 
      // testing and setting another callback
      fs.readFile(pkg.moduleRoot + '/' + String(pkg.ender), function (err, data) {
        if (err) {
          if ('string' === typeof pkg.ender) {
            fn(err);
            return;
          }
        } else {
          pkg.enderBridge = data.toString('utf8');
        }

        getModuleTree(pkg, leaf, leaf.require, function (err, tree) {
          fn(err, pkg, tree);
        });
      });
    });
  }

  module.exports.getPackageTree = getPackageTree;
}());
