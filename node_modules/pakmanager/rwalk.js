/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    , EventEmitter = require('events').EventEmitter
    ;

  fs.exists = fs.exists || path.exists;

  // TODO make into a real emitter subclass
  function readstats(cb, pathname, nodes, stats) {
    var node = nodes.pop()
      ;

    fs.lstat(path.join(pathname, node), function (err, stat) {
      stat = stat || { error: err };
      stat.path = pathname;
      stat.name = node;
      stats.push(stat);

      if (nodes.length > 0) {
        readstats(cb, pathname, nodes, stats);
      } else {
        cb(null, stats);
      }
    });
  }

  function readdir(cb, dir) {
    fs.readdir(dir, function (err, nodes) {
      if (err) {
        cb(err);
        return;
      }

      readstats(cb, dir, nodes, []);
    });
  }
  
  function rwalk(emitter, fullpath) {
    readdir(function (err, stats) {

      function next() {
        var fullpathArr
          ;

        // TODO handle escaped pathnames i.e. /path/to\/thing/here
        if ('/' === fullpath) {
          emitter.emit('end');
          return;
        }

        fullpathArr = fullpath.split(path.sep);
        fullpathArr.pop();
        fullpath = fullpathArr.join(path.sep) || '/';

        rwalk(emitter, fullpath);
      }

      emitter.emit('nodes', next, err, fullpath, stats);
    }, fullpath);
  }

  function rwalkHelper(fullpath) {
    var emitter = new EventEmitter()
      ;

    fullpath = path.normalize(path.resolve(process.cwd(), fullpath));
    rwalk(emitter, fullpath);
    return emitter;
  }

  function run() {
    var emitter = rwalkHelper(process.argv[2])
      ;

    emitter.on('nodes', function (next, err, dir, stats) {
      if (err) {
        console.error(err);
        console.error('couldn\'t find ' + process.argv[2]);
        next();
        return;
      }

      console.log(dir, stats.length);
      next();
    });
    emitter.on('end', function () {
      console.log('all done');
    });
  }

  if (require.main === module) {
    run();
  }

  exports.rwalk = rwalkHelper;
}());
