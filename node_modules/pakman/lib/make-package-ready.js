/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var sortTree = require('./sort-tree-by-types').sortTreeByTypes
    , reduceTree = require('./reduce-tree').reduceTree
    , getPackageTree = require('./get-package-tree').getPackageTree
    , normalizeDeps = require('./normalize-package-dependencies').normalizePackageDependencies 
    , normalizeReqs = require('./normalize-script-requires').normalizeScriptRequires
    ;

  function wrappedPackager(moduleRoot, builtIns, fn) {

    function makeReady(err, pkg, tree) {

      function makePackageReady(err, missing, builtin, local, pm) {
        var list
          , deps
          , missingList = []
          , unlisted = []
          , unused = []
          , builtinList = []
          , pmList = []
          , localList
          ;

        if (err) {
          fn(err);
          return;
        }

        list = reduceTree(tree);
        deps = normalizeDeps(pkg);

        Object.keys(missing).forEach(function (name) {
          missingList.push(missing[name]);
        });

        Object.keys(builtin).forEach(function (name) {
          builtinList.push(builtin[name]);
        });

        Object.keys(pm).forEach(function (name) {
          pmList.push(pm[name]);
        });

        localList = [];
        list.forEach(function (name) {
          var module = local[name];
          if (module) {
            localList.push(module);
          }
        });

        // TODO consolidate enderBridge
        // TODO make it easier to extend pakman
        if (pkg.enderBridge) {
          localList.push({   
              "package": pkg.name
            , "name": pkg.name + "/ender-bridge"
              // TODO make relative to lib
            , "pathname": pkg.ender.replace(/\/[^\/]*$/, '')
            , "filename": pkg.ender.split('/').pop()
            , "require": pkg.name + "/ender-bridge"
            , "modulepath": pkg.name + "/ender-bridge"
            , "providespath": (pkg.provides || pkg.name) + "/ender-bridge"
            , "requires": []
            , "scriptSource": pkg.enderBridge
              // ender-js is always implied
            , "dependencyList": []
            , "dependencyTree": {}
          });
        }

        normalizeReqs(localList, pkg);

        //
        // NPM 
        //
        Object.keys(deps).forEach(function (name) {
          if (-1 === Object.keys(pm).indexOf(name)) {
            unused.push(name);
          }
        });

        Object.keys(pm).forEach(function (name) {
          if (-1 === Object.keys(deps).indexOf(name)) {
            unlisted.push(name);
          }
        });

        fn(null, pkg, missingList, unlisted, unused, localList, pmList, builtinList);
      }

      if (err) {
        fn(err);
        return;
      }

      sortTree(tree, builtIns, makePackageReady);
    }
    
    getPackageTree(moduleRoot, makeReady);
  }

  module.exports.makePackageReady = wrappedPackager;
}());
