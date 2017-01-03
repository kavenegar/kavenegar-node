/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var npm = require('npm')
    , fs = require('fs')
    , path = require('path')
    , Future = require('future')
    , forEachAsync = require('forEachAsync')
    , future = Future.create()
    , getNpmTree = require('../lib/get-npm-tree').getNpmTree
    , reduceTree = require('../lib/reduce-tree').reduceTree
    , mapByDepth = require('../lib/reduce-tree').mapByDepth
    , reduceByDepth = require('../lib/reduce-tree').reduceByDepth
    , makePackageReady = require('../lib/make-package-ready').makePackageReady
    ;

  function compile(moduleRoot, builtIns, render, fn) {
    // TODO cache npm.commands.view results
    // TODO cache all npm commands (so that builds can be done without internet access)
    function buildAll(list) {
      var modulesList = []
        ;

      forEachAsync(list, function (next, modulename) {
        makePackageReady(moduleRoot + '/' + 'node_modules' + '/' + modulename, builtIns, function (err, pkg, m, u, v, l, p, b) {
          if (err) {
            console.error('[local#1]', err);
            next();
            return;
            //throw err;
          }

          l.forEach(function (module) {
            modulesList.push(render(module, pkg));
          });

          next();

          /*
          l.forEachAsync(function (next, module) {
            render(function (err, str) {
              modulesList.push(str);
            }, pkg, module));
          }).then(next);
          */
        });
      }).then(function () {
        makePackageReady(moduleRoot, builtIns, function (err, pkg, m, u, v, l, p, b) {
          l.forEach(function (module) {
            modulesList.push(render(module));
          });

          fn(null, modulesList.join('\n'));
          
          /*
          l.forEachAsync(function (next, module) {
            render(function (err, str) {
              modulesList.push(str);
            }, pkg, module);
          }).then(function () {
            fn(null, modulesList.join('\n'));
          });
          */
        });
      });
    }

    function install(modulename, fn) {
      var nextModuleRoot = moduleRoot + '/' + 'node_modules' + '/' + modulename
        ;

      fs.readdir(nextModuleRoot, function (err, nodes) {
        if (!err) {
          fn(null);
          return;
        }

        npm.commands.install(moduleRoot, [modulename], fn);
      });
      
    }

    function installAll(list) {
      // TODO check if installed
      forEachAsync(list, function (next, modulename) {
          // not using __dirname so that it will install in the cwd of the user
          install(modulename, function (err, array, map, versionAndPath) {
            if (err) {
              console.error('[NPM#7] [' + modulename + ']', err.message);
              //return;
            }   
            next();
            //gotModule(err, array, map, versionAndPath);
          }); 
      }).then(function () {
        buildAll(list);
      });
    }

    // TODO needs an emitter for listing files as read
    function log(err, pkg, tree) {
      var list
        ;

      if (err) {
        throw err;
      }

      // puts the list in the correct order
      list = reduceTree(tree);
      // pop off the bottom (this local package)
      list.pop();

      installAll(list);
    }

    getNpmTree(moduleRoot, log);
  }

  npm.load({}, future.fulfill);

  module.exports.compile = function () {
    var args = arguments;
    future.when(function () {
      compile.apply(null, args);
    });
  };
}());
