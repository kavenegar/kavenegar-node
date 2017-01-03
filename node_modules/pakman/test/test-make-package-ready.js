(function () {
  "use strict";

  var makePackageReady = require('../lib/make-package-ready').makePackageReady
    , moduleRoot = process.argv[2] || '../test_modules/foomodule'
    ;

  function log(err, pkg, missing, unlisted, unused, local, pm, builtin) {
    if (err) {
      console.error(err);
      return;
    }

    if (missing.length) {
      console.error('[ERROR] The following packages are `required`, but not in the package, nor on npm:');
      missing.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name));
      });
    }

    if (unlisted.length) {
      console.warn('[WARN] The following packages are `require`d, but not listed in package.json:');
      unlisted.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name || m));
      });
    }

    if (unused.length) {
      console.warn('[WARN] The following packages are listed in package.json, but never `require`d:');
      unused.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name || m));
      });
    }

    if (local.length) {
      console.log('[INFO] The following packages are part of this package:');
      local.forEach(function (m) {
        console.log('  ' + (m.modulepath || m.name));
      });
    }

    if (pm.length) {
      console.log('[INFO] The following packages are needed by this package:');
      pm.forEach(function (m) {
        console.log('  ' + (m.modulepath || m.name));
      });
    }

    if (builtin.length) {
      console.log('[INFO] The following modules are provided natively by the environment:');
      builtin.forEach(function (m) {
        console.log('  ' + (m.modulepath || m.name));
      });
    }
  }

  makePackageReady(moduleRoot, log);
}());
