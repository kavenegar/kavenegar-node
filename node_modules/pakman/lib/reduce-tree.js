/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
 (function () {
  "use strict";

  //You could traverse it like this
  function mapByDepth(rootPackage) {
    var depth = 0
      , allDeps = {}
      , superDepsList = {}
      ;

    function traverseDeps(childPackage) {
      depth += 1;

      childPackage.dependencyTree = childPackage.dependencyTree || {};
      Object.keys(childPackage.dependencyTree).forEach(function (depName) {
        var childDeps = (childPackage.dependencyTree[depName] || {}) || {}
          ;

        if (superDepsList[depName]) {
          // a dependency can't (meaning shouldn't) have a path in which it depends on itself
          // this kind of resolution isn't as important as it once was
          // since the modules can be loaded out-of-order
          return;
        }

        superDepsList[depName] = true;

        allDeps[depth] = allDeps[depth] || [];
        allDeps[depth].push(depName);

        if (childDeps) {
          traverseDeps(childDeps);
        }

        superDepsList[depName] = false;
      });

      depth -= 1;
    }

    traverseDeps(rootPackage);

    return allDeps;
  }

  // And then you can reduce that result into a simple 1-dimentional list like so:
  function reduceByDepth(depthTree) {
    var order = 0
      , handled = {}
      , useInOrder = []
      ;

    // it's important to sort and reverse the key listing so that 
    // the most deeply depended on modules are always installed first and listed first in ender.js
    Object.keys(depthTree).sort().reverse().forEach(function (depth) {
      var depNames = depthTree[depth]
        ;

      depNames.forEach(function (depName) {
        if (!handled[depName]) {
          handled[depName] = true;
          useInOrder.push(depName);
        }
      });

    });

    return useInOrder;
  }

  function sortByDepth(rootPackage) {
    var dependencyTree = {};
    dependencyTree[rootPackage.modulepath || rootPackage.name] = rootPackage;
    return reduceByDepth(mapByDepth({
      dependencyTree: dependencyTree
    }));
  }

  module.exports.mapByDepth = mapByDepth;
  module.exports.reduceByDepth = reduceByDepth;
  // maps and reduces
  module.exports.sortByDepth = sortByDepth;
  module.exports.reduceTree = sortByDepth;
}());
