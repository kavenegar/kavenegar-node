(function () {
  "use strict";

  var pakman = module.exports
    , allFunctions
    ;

  function addToApi(func) {
    var mod = require('./' + func)
      ;

    Object.keys(mod).forEach(function (key) {
      pakman[key] = mod[key];
    });
  }

  allFunctions = [
      'compile'
    , 'get-file'
    , 'get-module-leaf'
    , 'get-module-tree'
    , 'get-npm-package-info'
    , 'get-npm-tree'
    , 'get-package-info'
    , 'get-package-tree'
    , 'get-requires'
    , 'get-script'
    , 'make-package-ready'
    , 'normalize-package-dependencies'
    , 'normalize-script-requires'
    , 'reduce-tree'
    , 'sort-tree-by-types'
  ];

  allFunctions.forEach(addToApi);
}());
