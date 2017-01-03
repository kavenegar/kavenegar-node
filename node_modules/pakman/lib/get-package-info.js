(function () {
  "use strict";

  var fs = require('fs')
    , path = require('path')
    ;

  function getPackageInfo(moduleRoot, masterCallback) {

    function onPackageJsonRead(err, meta) {
      var sub = {}
        ;

      if (err) {
        masterCallback(err);
        return;
      }

      try {
        meta = JSON.parse(meta.toString('utf8'));
      } catch(e) {
        masterCallback(e);
        return;
      }

      // TODO allow overlay

      // the main file is a special case
      meta.lib = meta.lib || meta.directories && meta.directories.lib || '.';
      meta.lib = path.normalize(meta.lib);

      meta.main = meta.main || (meta.lib + '/' + 'index');
      meta.main = path.normalize(meta.main);

      meta.moduleRoot = moduleRoot;

      masterCallback(null, meta);

    }

    fs.readFile(moduleRoot + '/package.json', onPackageJsonRead);
  }

  module.exports.getPackageInfo = getPackageInfo;
}());
