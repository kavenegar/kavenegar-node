/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var path = require('path')
    , reIsLocal = /^\.{0,2}\//
    , getScript = require('./get-script').getScript
    , getRequires = require('detective')
    , oldGetRequires = require('./get-requires').getRequires
    , escapeRegExpPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
    ;

  function escapeRegExp(str) {
    return str.replace(escapeRegExpPattern, "\\$&");
  }

  function getModuleLeaf(pkg, prev, requireString, callback) {
    var paths
      , modulepath = ''
      , leaf = {}
      , submoduleRoot
      , rePkgLib
      ;

    function onShownLocalDeps(err, leaf) {
      //modulepath = path.normalize(pkg.name + '/' + modulepath);

      //leaf.pathname = leaf.pathname || '.';
      leaf.require = requireString;
      // fixes ISSUE#5
      leaf.requiredAs = { requireString: true };
      leaf.modulepath = modulepath;
      leaf.name = leaf.modulepath;
      leaf.package = pkg.name;
      try {
        // sometimes the real-deal parser is too strict... stupid semi-colons
        leaf.requires = getRequires(leaf.scriptSource || '');
      } catch(e) {
        console.error(__filename);
        console.error(e);
        console.error(leaf);
        console.error(leaf.package);
        console.error(leaf.filename);
        // a much stupider, but still fairly accurate parser
        leaf.requires = oldGetRequires(leaf.scriptSource || '');
      }

      callback(null, pkg, prev, leaf);
    }

    function onReadLocalDeps(err, dir, name, src) {
      if (err) {
        leaf.error = err;
      } else {
        leaf.scriptSource = src;
        leaf.pathname = path.normalize(dir);
        leaf.filename = name;
      }

      onShownLocalDeps(null, leaf);
    }

    // handle the case that this is main
    if (null === prev || !requireString || pkg.name === requireString) {

      // TODO have one, universal way of distiguishing as main
      modulepath = pkg.name;
      getScript(pkg, pkg.main, onReadLocalDeps);

    } else if (reIsLocal.exec(requireString)) {

      // resolve the filepath to a modulepath
      leaf.filepath = path.normalize(prev.pathname + '/' + requireString);

      // make sure they aren't trying to get outside of the module root
      submoduleRoot = path.normalize(pkg.moduleRoot + '/' + leaf.filepath);
      if (!/^\.\./.test(submoduleRoot)) {
        // ${MODULE_ROOT}/lib/baz -> require('${MODULE_ROOT}/baz')
        // if 'lib' === package.json.lib
        //
        // foobar/dinosaur/baz.js -> require('foobar/baz') when
        // if 'dinosaur' === package.json.lib
        rePkgLib = new RegExp('(^|\/)' + escapeRegExp(path.normalize(pkg.lib) + '/'));
        modulepath = pkg.name + '/' + leaf.filepath.replace(rePkgLib, '$1');
        // TODO not sure what foobar/lib/baz/lib/garply will resolve to... it would probably break stuff
      } else {
        // TODO turn this into an error
        // allowing arbitrary file access is a BAD idea
        // ${MODULE_ROOT}/../../../../../root/.ssh/id_rsa -> require('${MODULE_ROOT}/root/.ssh/id_rsa')
        console.warn(__filename + ':');
        console.warn(
            '[WARN] \''
          + path.normalize(
                pkg.moduleRoot
              + '/'
              + leaf.filepath
            )
          + '\' is outside of the module root "'
          + pkg.moduleRoot
          + '".'
        );
        modulepath = pkg.name + '/' + leaf.filepath;
      }

      getScript(pkg, leaf.filepath, onReadLocalDeps);

    } else if (pkg.name === requireString.split('/')[0]) {

      // resolve to a filepath
      paths = requireString.split('/');
      paths[0] = pkg.lib;
      getScript(pkg, paths.join('/'), onReadLocalDeps);
      modulepath = requireString;

    } else {

      // check for this package in npm
      modulepath = requireString.split('/')[0];
      callback(null, pkg, prev, {
          name: modulepath
        , require: requireString
        , modulepath: modulepath
      });

    }
  }

  module.exports.getModuleLeaf = getModuleLeaf;
}());
