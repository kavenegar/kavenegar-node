/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";
  
  var rwalk = require('./rwalk').rwalk
    , path = require('path')
    ;

  exports.findPackage = function (cb, fullpath) {
    var emitter = rwalk(fullpath)
      ;

    emitter.on('nodes', function (next, err, dir, stats) {
      var hasPackage
        ;

      if (err) {
        //console.error(err);
        //console.error('couldn\'t find ' + process.argv[2]);
        next();
        return;
      }

      hasPackage = stats.some(function (stat) {
        if ('package.json' === stat.name) {
          return true;
        }
      });

      if (!hasPackage) {
        next();
        return;
      }

      //try {
        cb(require(path.join(dir, 'package.json')).browserDependencies ? 'browser' : 'guess');
      //} catch(e) {
       // next();
      //}
    });

    emitter.on('end', function () {
      cb('guess');
    });
  };
}());
