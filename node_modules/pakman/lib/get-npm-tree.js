/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var npm = require('npm')
    , forEachAsync = require('forEachAsync')
    , getPackageInfo = require('./get-package-info').getPackageInfo
    , getNpmPackageInfo = require('./get-npm-package-info').getNpmPackageInfo
    ;

  function getAllNpmDeps(pkg, callback) {
    var modules = {}
      ;

    function helper(leaf, callback) {
      var depnames
        , depnamesObj
        ;

      function eachDep(next, modulename) {
        var tuple = modulename.split('@')
          , version = tuple[1] || '>= 0.0.0'
          ;

        modulename = tuple[0];

        function onNpm(err, map, array) {
          if (err) {
            leaf.dependencyTree[modulename] = {
                name: modulename
              , version: version
              , error: err
              , npm: true
            };
          } else {
            leaf.dependencyTree[modulename] = array[array.length - 1];
            if (!leaf.dependencyTree[modulename]) {
              console.error('[leaf.deapendencyTree]', modulename);
            }
            leaf.dependencyTree[modulename].npm = true;
          }

          modules[modulename] = modules[modulename] || leaf.dependencyTree[modulename];
          helper(leaf.dependencyTree[modulename], next);
        }

        getNpmPackageInfo(modulename + '@' + version, onNpm);
      }

      function onDone() {
        var tree = JSON.parse(JSON.stringify(pkg))
          ;

        tree.dependencyTree = modules;

        callback(null, pkg, tree);
      }

      // TODO manage this from one location (it's also elsewhere in the code)
      depnamesObj = (leaf.ender && leaf.ender.dependencies) || leaf.enderDependencies || leaf.browserDependencies || leaf.dependencies || [];

      if (Array.isArray(depnamesObj)) {
        depnames = depnamesObj;
      } else {
        depnames = [];
        Object.keys(depnamesObj).forEach(function (name) {
          var version = depnamesObj[name] || ''
            ;

          version = version ? '@' + version.trim() : '';

          depnames.push(name + version);
        });
      }

      leaf.dependencyTree = {};
      forEachAsync(depnames, eachDep).then(onDone);
    }

    helper(pkg, callback);
  }

  function getNpmTree(moduleRoot, fn) {
    if ('object' === typeof moduleRoot) {
      getAllNpmDeps(moduleRoot, fn);
      return;
    }

    getPackageInfo(moduleRoot, function (err, pkg) {
      if (err) {
        fn(err);
        return;
      }
      
      getAllNpmDeps(pkg, fn);
    });
  }

  module.exports.getNpmTree = getNpmTree;
}());
