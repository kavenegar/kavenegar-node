(function () {
  "use strict";

  var makePackageReady = require('../lib/make-package-ready').makePackageReady
    , moduleRoot = process.argv[2] || '../test_modules/foomodule'
    ;

  function templateModule(err, pkg, missing, unlisted, unused, local, pm, builtin) {
    if (err) {
      console.error(err);
      return;
    }

    if (missing.length) {
      console.warn('[WARN] The following packages are `required`, but not in the package, nor on npm:');
      missing.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name));
      });
    }

    local.forEach(function (module) {
      var newScript
        ;

      // module.providespath is added by normalizeScriptRequires
      // TODO move to where?

      if (!module) {
        return;
      }
      
      // I'm using the 'ender:' prefix to make it
      // easier to search for a module start
      newScript = ''
        + '\n// ender:' + module.modulepath + ' as ' + module.providespath
        + '\n(function () {' 
        + '\n  "use strict";' 
        + '\n  '
        + '\n  var module = { exports: {} }, exports = module.exports'
        + '\n    , $ = require("ender")'
        + '\n    ;'
        + '\n  '
        + '\n  '
        + '\n  ' + module.scriptSource.replace(/\n/g, '\n  ')
        + '\n'
        + '\n  provide("' + module.providespath + '", module.exports);'
        + '\n  $.ender(module.exports);'
        + '\n}());'
        ;

      console.log(newScript);
    });

    console.log(local.length);
  }

  makePackageReady(moduleRoot, templateModule);
}());
