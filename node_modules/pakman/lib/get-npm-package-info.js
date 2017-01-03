/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  var npm = require('npm')
    , future = require('future').create()
    , fs = require('fs')
    , path = require('path')
    , getPackageInfo = require('./get-package-info').getPackageInfo
    , reIsLocal = /^\.{0,2}\//
    , cachedNpmModules = {}
      // TODO allow dirs other than ./
    , nodeModulesRoot = process.cwd()
    ;

  // https://github.com/isaacs/npm/issues/1493
  // this massages a confusing part of the API
  function hotFix1493(map) {
    var fixedArray = []
      ;

    // Updated: upstream fixed the map issue
    // left the array in for fun (this also may be fixed)

    Object.keys(map).sort().forEach(function (version) {
      fixedArray.push(map[version]);
    });

    return fixedArray;
  }

  function view(packageName, callback) {
    var nameOnly
      ;

    function onViewable(err, map, array) {
      cachedNpmModules[nameOnly] = {
          error: err
        , map: map
        , array: array
      };

      callback(err, map, array);
    }

    function fixView(err, map) {
      var array
        ;

      if (!err) {
        array = hotFix1493(map);
        cachedNpmModules[nameOnly] = { error: err, map: map, array: array };
      }

      // TODO replace with `emitter`
      console.info('reading "' + nameOnly + '" from npm');
      return array;
    }

    function manglePackageJson(err, data) {
      var map = {}
        , array = []
        ;

      if (err) {
        console.error('Could not read "' + packageName + '/package.json'  + '"');
        onViewable(err);
        return;
      }

      try {
        data = JSON.parse(data)
      } catch(e) {
        console.error('Could not parse "' + packageName + '/package.json'  + '"');
        onViewable(e);
        return;
      }

      map[data.version || '0.0.0'] = data;
      array.push(data);

      onViewable(err, map, array);
    }

    if (reIsLocal.exec(packageName)) {
      packageName = path.resolve(packageName);
      nameOnly = packageName;

      if (cachedNpmModules[nameOnly]) {
        onViewable(cachedNpmModules[nameOnly].error, cachedNpmModules[nameOnly].map, cachedNpmModules[nameOnly].array);
        return;
      }

      fs.readFile(packageName + '/package.json', manglePackageJson);
    } else {
      // TODO handle version comparison properly
      nameOnly = packageName.split('@')[0];

      if (cachedNpmModules[nameOnly]) {
        onViewable(cachedNpmModules[nameOnly].error, cachedNpmModules[nameOnly].map, cachedNpmModules[nameOnly].array);
        return;
      }

      npmView(nameOnly, onViewable);
    }
  }

  function npmView(nameOnly, fn) {
    // prefer local info
    getPackageInfo(nodeModulesRoot + '/node_modules/' + nameOnly, function (err, pkg) {
      var map = {}
        , array = [pkg]
        ;

      if (!err) {
        map[pkg.version || '0.0.0'] = pkg;
        fn(err, map, array);
        return;
      }

      npm.commands.view([nameOnly], true, function (err, map) {
        var array
          ;

        if (!err) {
          array = hotFix1493(map);
        }

        fn(err, map, array);
      });
    });
  }

  npm.load({}, future.fulfill);

  module.exports.getNpmPackageInfo = function () {
    var args = arguments;
    future.when(function () {
      view.apply(null, args);
    });
  };

}());
