/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var getModuleLeaf = require('./get-module-leaf').getModuleLeaf
    , forEachAsync = require('forEachAsync')
    , url = require('url')
    ;

  //
  // this wraps the non-recursive getModuleLeaf to be recursive
  //
  function getModuleTreeHelper(err, allDepsList, pkg, prev, requireString, callback) {

    function handleLeaf(err, pkg, prev, leaf, c, d, e) {
      if (err) {
        callback(err);
        return;
      }
     
      // turns require strings into dependency objects
      function traverseLeaf(next, requireString, requireIndex) {
        var reqPath
          , reqDeps
          ;

        if ('.' === requireString[0]) {
          reqPath = url.resolve('/' + leaf.modulepath, requireString).substr(1); // strip leading '/'
        } else {
          // TODO handle absolute paths
          reqPath = requireString;
        }

        // check that we haven't visited this dependency tree already
        reqDeps = allDepsList[reqPath];
        if (reqDeps) {
          reqDeps.requiredAs[requireString] = true;
          leaf.dependencyList[requireIndex] = reqDeps;
          next();
          return;
        }

        getModuleTreeHelper(null, allDepsList, pkg, leaf, requireString, function (err, deps) {
          if (err) {
            callback(err);
            return;
          }

          leaf.dependencyList[requireIndex] = deps;
          next();
        });
      }

      function callCallback() {
        var deps = {}
          ;

        (leaf.dependencyList || []).forEach(function (dep) {
          // modulepath for local modules, dep.name for npm modules
          deps[dep.modulepath || dep.name] = dep;
        });

        leaf.dependencyTree = deps;
        callback(null, leaf);
      }

      if (!leaf.requires || 0 === leaf.requires.length) {
        callback(null, leaf);
        return;
      }

      allDepsList[leaf.modulepath] = leaf;

      leaf.dependencyList = [];
      forEachAsync(leaf.requires, traverseLeaf).then(callCallback);
    }

    // this function does not recurse
    getModuleLeaf(pkg, prev, requireString, handleLeaf);
  }

  function getModuleTree(pkg, prev, requireString, fn) {
    getModuleTreeHelper(null, {}, pkg, prev, requireString, function (err, tree) {
      tree.modulepath = tree.name;
      fn(err, tree);
    });
  }

  module.exports.getModuleTree = getModuleTree;
}());
