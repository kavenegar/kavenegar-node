#!/usr/bin/env node
(function () {
  "use strict";

  var args = require('./argparse').parse()
    , findBrowser = require('../has-browser').findBrowser
    , findPackage = require('../has-package').findPackage
    , pakmanager
    , cwd
    ;

  function isReady(env) {
    console.log('Targeted Environment:', env);
    args.env = env;
    args.environment = env;

    pakmanager = require('../lib').create({ packageRoot: cwd });

    function doAction() {
      var action = args.subcommand_name
        ;

      console.log('[[[' + action + ']]]');
      if (pakmanager[action]) {
        pakmanager[action](function () {
          if ('build' === action) {
            console.log('wrote pakmanaged.js');
          } else {
            console.log('pakmanager', arguments);
          }
        }, args);
      }
    }

    return doAction();
    //tryPackageJson();
  }

  /*
  console.log('parsed args:');
  console.log(typeof args);
  console.dir(args);
  */
  /*
    {
        environment: 'guess',
        change_dir: '/path/to/dir',
        subcommand_name: 'build',
        env: null
    }
  */

  // TODO try to find root by rwalk
  cwd = args.change_dir || process.cwd();
  args.packageRoot = cwd;
  console.log(cwd);

  if (-1 !== ['browser', 'node'].indexOf(args.environment)) {
    isReady(args.environment);
    return;
  }

  findBrowser(function (type) {
    if ('guess' !== type) {
      isReady(type);
      return;
    }

  //"browserDependencies": {},
    // TODO don't default so heavily to browser
    findPackage(function (type1) {
      if ('guess' !== type1) {
        isReady(type1);
      } else {
        console.warn('\n\n======================= WARNING =======================');
        console.warn('Assuming browser mode by default is deprecated.');
        console.warn('  Include browserDependencies in your package.json');
        console.warn('  -- OR --');
        console.warn('  pakmanager -e browser build');
        console.warn('\nIn the next release of pakmanager, the node environment will be assumed as default');
        console.warn('=======================================================\n\n');
        isReady('browser');
      }
    }, cwd);
  }, cwd);
}());
