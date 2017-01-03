/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  function normalizePackageDependencies(pkg) {
    var deps = (pkg.ender && pkg.ender.dependencies) || pkg.enderDependencies || pkg.browserDependencies || pkg.dependencies || {}
      , depsArr = deps
      ;
      
    function depsArrayToMap(dep) {
      var depParts = dep.split('@')
        ;

      deps[depParts[0]] = depParts[1] || '>= 0.0.0';
    }

    if (Array.isArray(depsArr)) {
      deps = {};
      depsArr.forEach(depsArrayToMap);
    }

    depsArr = [];
    Object.keys(deps).forEach(function (key) {
      depsArr.push(key + '@' + deps[key]);
    });

    //return depsArr;
    return deps;
  }

  module.exports.normalizePackageDependencies = normalizePackageDependencies;
}());
