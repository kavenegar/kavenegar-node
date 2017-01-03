/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  var fs = require('fs')
    , getFile = require('./get-file').getFile
    , endsWithJs = /\.js$/
    ;

  function getScript(pkg, pathname, callback) {
    var paths
      , name
      , moduleRoot = pkg.moduleRoot
      , main = 'index.js' // can't use package.json.main for everything
      ;

    function onFileRead(err, data) {
      if (err) {
        console.error('[ERROR (getScript)] :', pathname);
        callback(err);
        return;
      }

      data = data.toString('utf8');
      callback(null, paths.join('/'), name, data);
    }

    function onDirRead(err, nodes) {
      if (err) {
        callback(new Error("Couldn't find \"" + moduleRoot + '/' + paths.join('/') + "\""));
        return;
      }

      if (-1 !== nodes.indexOf(name + '.js')) {
        // probably a file
        name += '.js';
        getFile(moduleRoot + '/' + pathname + '.js', onFileRead);
      } else if (-1 !== nodes.indexOf(name)) {
        if (endsWithJs.exec(name)) {
          // probably a file
          getFile(moduleRoot + '/' + pathname, onFileRead);
        } else {
          // probably a directory
          paths.push(name);
          name = main;
          getFile(moduleRoot + '/' + pathname + '/' + main, onFileRead);
        }
      } else {
        // not a directory nor a file
        // probably doesn't exist
        callback(new Error("Couldn't find \"" + pathname + "\""));
      }
    }

    paths = pathname.split('/');
    name = paths.pop();
    
    fs.readdir(moduleRoot + '/' + paths.join('/'), onDirRead);
  }

  module.exports.getScript = getScript;
}());
