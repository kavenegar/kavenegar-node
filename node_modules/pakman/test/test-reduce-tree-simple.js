#!/usr/bin/env node
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  // simply have an empty object rather than -1, 0, etc
  // This way `Object.keys(deps).forEach(fn)` will simply be a noop on `{}`,
  // which is much more intuitive than `if {} else`ing on -1 and 0
  // whether or not a module is installed can be handled elsewhere (as you will see later on)
  var traverser = require('../lib/reduce-tree')
    , forEachAsync = require('forEachAsync')
    , packageTree = {
          "dependencyTree": {
              "foo": {
                  "dependencyTree": {
                      "bar": {}
                  }
              }
            , "baz": {
                  "dependencyTree": {
                      "bar": {}
                    , "qux": {}
                    , "quux": {
                          "dependencyTree": {
                              "bar": {}
                            , "corge": {
                                  "dependencyTree": {
                                      "bar": {}
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
    , depthTree
    , installArray
    ;

  function doInstall(next, depName) {
    // whatever needs to happen for the install to complete goes here
    // maybe don't reinstall if you don't need to 
    // (but it's probably best to always reinstall anyway)
    //npm.commands.install(__dirname + '/', ['future'], function (err, a, b, c) {
    next();
  }

  depthTree = traverser.mapByDepth(packageTree);
  // The result of the traversal will be this:
  /*
  JSON.stringify(depthTree, null, '  ');
  {
      "1": [ "foo", "baz" ]
    , "2": [ "bar", "bar", "qux", "quux" ]
    , "3": [ "bar", "corge" ]
    , "4": [ "bar" ]
  }
  */

  installArray = traverser.reduceByDepth(depthTree);
  console.log(depthTree);
  console.log(installArray);
  installArray = traverser.sortByDepth(packageTree);
  console.log(installArray);
  //As you can see, this produces a very clean array of which order the modules must be used and installed in:
  /*
  JSON.stringify(useInOrder);
  ["bar", "corge", "qux", "quux", "foo", "baz"]
  */
  //Then you can do the module installs and write out to ender.js:


  forEachAsync(installArray, doInstall).then(function () {
    installArray.forEach(function (dep) {
      // replace this log with the function that writes the module out to ender.js
      console.log(dep);
    });
  });

}());
