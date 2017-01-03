/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";
  
  var rwalk = require('./rwalk').rwalk
    , path = require('path')
    ;

  exports.findBrowser = function (cb, fullpath) {
    var emitter = rwalk(fullpath)
      ;
    emitter.on('nodes', function (next, err, dir, stats) {
      var hasBrowser
        ;

      if (err) {
        //console.error(err);
        //console.error('couldn\'t find ' + process.argv[2]);
        next();
        return;
      }

      hasBrowser = stats.some(function (stat) {
        return 'browser' === stat.name;
      });

      dir = path.normalize(dir);
      if (hasBrowser) {
        if (path.normalize(dir) === path.normalize(fullpath)) {
          //console.log('this is probably a server app');
          cb('node');
        } else {
          //console.log('this is probably a browser app (below the browser folder)');
          cb('browser');
        }
        return;
      }

      next();
    });
    emitter.on('end', function () {
      cb('guess');
    });
  };
}());
