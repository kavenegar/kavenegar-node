/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var npm = require('npm')
    , Future = require('future')
    , forEachAsync = require('forEachAsync')
    , getNpmPackageInfo = require('./get-npm-package-info').getNpmPackageInfo
    , future = Future.create()
    , fs = require('fs')
    , path = require('path')
    , allModules = {}
    ;

  function isBuiltIn(builtIns, modulename) {
    return -1 !== builtIns.indexOf(modulename);
  }

  function sortDeps(packageTree, builtIns, callback) {
    var missingDeps = {}
      , npmDeps = {}
      , localDeps = {}
      , builtIn = {}
      , superDependencyTree = {}
      , dependencyList = {}
      ;

    function sortDepsHelper(dependencyTree, callback) {
      function eachDep(next, modulename) {
        var module = dependencyTree[modulename]
          ;

        function onReady() {
          // prevent super recursion
          if (dependencyList[modulename]) {
            next();
            return;
          }
          dependencyList[modulename] = true;

          sortDepsHelper(module.dependencyTree, next);
        }

        function onNpm(err, map, array) {
          if (err) {
            missingDeps[modulename] = module;
          } else {
            npmDeps[modulename] = array[0];
            module.npm = true;
          }

          onReady();
        }

        if (isBuiltIn(builtIns, modulename)) {
          builtIn[modulename] = module;
        }
        else if (module.error) {
          missingDeps[modulename] = module;
        }
        else if (module.pathname && !module.warning) {
          // fixes ISSUE#5
          localDeps[modulename] = localDeps[modulename] || module;
          if (module.require) {
            localDeps[modulename].requiredAs[module.require] = true;
          }
        }
        else {
          // possibly something like foo/bar, for which foo is the real dependency
          modulename = modulename.split('/')[0];
          getNpmPackageInfo(modulename, onNpm);
          return;
        }

        onReady();
      }

      function onDone() {
        callback(null, missingDeps, builtIn, localDeps, npmDeps);
      }

      forEachAsync(Object.keys(dependencyTree || {}), eachDep).then(onDone);
    }

    superDependencyTree[packageTree.modulepath || packageTree.name] = packageTree;
    sortDepsHelper(superDependencyTree, callback);
  }

  npm.load({}, future.fulfill);

  module.exports.sortTreeByTypes = function () {
    var args = arguments;
    future.when(function () {
      sortDeps.apply(null, args);
    });
  };
}());
