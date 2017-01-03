/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";
  
  var rwalk = require('./rwalk').rwalk
    , path = require('path')
    , fullpath = path.normalize(process.argv[2])
    , emitter
    ;

  emitter = rwalk(fullpath);
  emitter.on('nodes', function (next, err, dir, stats) {
    var pkgExists
      , hasBrowser
      ;

    if (err) {
      console.error(err);
      console.error('couldn\'t find ' + process.argv[2]);
      next();
      return;
    }

    pkgExists = stats.some(function (stat) {
      if ('package.json' === stat.name) {
        console.log('happy with the results...', dir);
        return true;
      }

      if ('browser' === stat.name) {
        hasBrowser = true;
      }
    });

    console.log(dir, stats.length);
    if (pkgExists) {
      return;
    }
    next();
  });
  emitter.on('end', function () {
    console.log('all done');
  });
 
}());
