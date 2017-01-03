(function () {
  "use strict";

  var getNpmTree = require('../lib/get-npm-tree').getNpmTree
    , reduceTree = require('../lib/reduce-tree').reduceTree
    , mapByDepth = require('../lib/reduce-tree').mapByDepth
    , reduceByDepth = require('../lib/reduce-tree').reduceByDepth
    , moduleRoot = process.argv[2] || '../test_modules/foomodule'
    ;

  // TODO needs an emitter for listing files as read
  function log(err, pkg, tree) {
    var list
      ;

    if (err) {
      throw err;
    }

    console.log(Object.keys(tree));
    //console.log(mapByDepth(tree));
    list = reduceTree(tree);

    console.log(list);
    
    //console.log(tree['futures']);
  }

  getNpmTree(moduleRoot, log);

}());
