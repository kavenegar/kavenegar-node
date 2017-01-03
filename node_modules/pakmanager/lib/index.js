(function () {
  "use strict";

  var pakman = require('pakman')
    //, pakman = require('../../node-pakman')
    , fs = require('fs')
    , path = require('path')
    , nodeNatives = require('./node-natives.js')
    , browserNatives = require('./browser-natives.js')
    , findBrowser = require('../has-browser').findBrowser
    , findPackage = require('../has-package').findPackage
    ;

  function noop() {}

  function Pakmanager() {
    /*
    function getEnvironment(params) {
      var builtIns
        ;

      if (params.environment === 'node') {
        builtIns = nodeNatives;
      } else {
        builtIns = browserNatives;
      }

      return builtIns;
    }
    */
  }

  Pakmanager.prototype.build = function (fn, params) {
    var me = this
      ;

    function onBuilt(outData) {
      var outPath = params.outfile || path.join(me._packageRoot, 'pakmanaged.js')
        ;

      fs.writeFile(outPath, outData, 'utf8', fn);
      /*
      fs.writeFile(path.join(packageRoot, 'pakmanaged.html'), ''
        +   '<html>'
        + '\n<head><script src="pakmanaged.js"></script></head>'
        + '\n<head><script src="pakmanaged-test.js"></script></head>'
        + '\n<body>' 
        + '\n  Open your debug console and check for errors'
        + '\n  <br/>'
        + '\n  You might also want to throw some tests into pakmanaged-test.js'
        + '\n</body>'
        + '\n</html>'
      , 'utf8');
      */
      //console.warn('[WARN] iHeartTheBadParts (non-strict mode) on by default\n');
      //console.log('wrote pakmanaged.js and pakmanaged.html');
    }

    me.init(function () {
      me.compile(onBuilt);
    }, params);
  };
  Pakmanager.prototype.compile = function (fn) {
    var me = this
      , builtIns
      // ls ~/Code/node/lib/ | grep '' | cut -d'.' -f1 | while read M; do echo , \"${M}\"; done
      , loaderJs
      , loaderScript
        // TODO allow compiling outside of cwd
      ;

    if ('browser' === me._target) {
      loaderJs = path.join(__dirname, '..', 'vendor', 'ender-js', 'ender.js');
    } else {
      loaderJs = path.join(__dirname, '.', 'pakmanager-loader.js');
    }

    // BUG sync call
    loaderScript = fs.readFileSync(loaderJs, 'utf8');

    function templateModule(module, pkg) {
      var newScript = ''
        ;   

      // module.providespath is added by normalizeScriptRequires
      // TODO move to where?

      if (!module) {
        console.error('missing module', module);
        return;
      }   

      if (!module.scriptSource) {
        console.error('missing script source', module);
        return;
      }   
    
      // I'm using the 'pakmanager:' prefix to make it
      // easier to search for a module start
      // TODO use AMD-style define 
      newScript += ''
        + '\n// pakmanager:' + module.modulepath
        ;

      if (module.modulepath !== module.providespath) {
      newScript += ''
        + ' as ' + module.providespath
        ;
      }

      newScript += ''
        + '\n(function (context) {' 
        ;

      if ('node' === me._target) {
      newScript += ''
        + '\n  function factory(exports) {'
        + '\n  '
        + '\n  var module = { exports: exports }'
        ;
      } else {
      newScript += ''
        //+ '\n  "use strict";' 
        + '\n  '
        + '\n  var module = { exports: {} }, exports = module.exports'
        ;
      }

      if ('browser' === me._target) {
        newScript += ''
          + '\n    , $ = require("ender")'
          ;
      }

      newScript += ''
        + '\n    ;'
        + '\n  '
        ;

      newScript += ''
        + '\n  ' + module.scriptSource.replace(/\n/g, '\n    ')
        ;

      if ('node' === me._target) {
      newScript += ''
        + '\n    return module.exports;'
        + '\n  }'
        ;
      }
      
      if ('node' === me._target) {
      newScript += ''
        + '\n  factory.__pakmanager_factory__ = true;'
        + '\n  provide("' + module.modulepath + '", factory);'
        ;
      } else {
      newScript += ''
        + '\n  provide("' + module.modulepath + '", module.exports);'
        ;   
      }

      if (module.modulepath !== module.providespath) {
        newScript += '\n  provide("' + module.providespath + '", module.exports);';
      }

      // TODO has ender bridge or something like that
      if ('browser' === me._target && pkg && (pkg.ender || (pkg.keywords && -1 !== pkg.keywords.indexOf('ender')))) {
        newScript += '\n  $.ender(module.exports);';
      }

      //console.log('modulepath:', module.modulepath);
      //console.log('module keys:', Object.keys(module));
      //console.log('module package:', pkg);

      newScript += '\n}(global));';

      return newScript;
    }

    if (me._target === 'node') {
      builtIns = nodeNatives;
    } else {
      builtIns = browserNatives;
    }

    if (me._verbose) {
      console.log(me);
    }

    pakman.compile(me._packageRoot, builtIns, templateModule, function (err, compiled) {
      var outData = ''
          //+ '(function () {\n'
          + 'var global = Function("return this;")();\n'
          // force users of the framework to use require rather than globals
          //+ 'var window, navigator, location, FormData, File, localStorage;\n'
          + loaderScript 
          + compiled
          + ('node' === me._target ? '\nrequire("pakmanager.main");' : '')
          //+ '}());\n'
        ;

      fn(outData);
    });
  };
  Pakmanager.prototype.init = function (isReady, config) {
    var me = this
      ;

    isReady = isReady || function () {};

    if (!config) {
      return;
    }

    me._packageRoot = config.packageRoot || process.cwd();

    if (config.target || config.environment) {
      me._target = config.target || config.environment;
      process.nextTick(function () {
        isReady();
      });
      return;
    }

    function onFoundPackage(type1) {
      if ('guess' !== type1) {
        me._target = type1;
      } else {
        console.warn('\n\n======================= WARNING =======================');
        console.warn('Assuming browser mode by default is deprecated.');
        console.warn('  Include browserDependencies in your package.json');
        console.warn('  -- OR --');
        console.warn('  pakmanager -e browser build');
        console.warn('\nIn the next release of pakmanager, the node environment will be assumed as default');
        console.warn('=======================================================\n\n');
        me._target = 'browser';
      }
      isReady();
    }

    function onFoundBrowser(type) {
      if ('guess' === type) {
        //"browserDependencies": {},
        // TODO don't default so heavily to browser
        findPackage(onFoundPackage, me._packageRoot);
        return;
      }

      me._target = type;
      isReady();
    }

    findBrowser(onFoundBrowser, me._packageRoot);
  };
  Pakmanager.create = function (config) {
    var pakmanager = new Pakmanager()
      ;

    pakmanager.init(noop, config);

    return pakmanager;
  };

  function arrRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
  }
  function logDeps(err, pkg, missing, unlisted, unused, local, pm, builtin) {
    if (err) {
      console.error(err);
      return;
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
  function displayResults(err, pkg, missing, unlisted, unused /*, local, pm, builtin*/) {
    if (err) {
      console.log(err);
      return;
    }

    if (missing.length) {
      console.error('[ERROR] The following packages are `require`d, but not in the package, nor on npm:');
      missing.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name));
      });   
    }     

    unlisted.forEach(function (name, i) {
      if ('ender' === name) {
        arrRemove(unused, i);
      }
    });
    if (unlisted.length) {
      console.warn('[WARN] The following packages are `require`d, but not listed in package.json:');
      unlisted.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name || m));
      });   
    }     

    // TODO determine by pkg.ender pkg.keywords.ender
    unused.forEach(function (name, i) {
      if (-1 !== ['jeesh', 'bonzo', 'bean', 'qwery'].indexOf(name)) {
        arrRemove(unused, i);
      }
    });
    if (unused.length) {
      console.warn('[WARN] The following packages are listed in package.json, but never `require`d:');
      unused.forEach(function (m) {
        console.warn('  ' + (m.modulepath || m.name || m));
      });   
    }     

  }
  Pakmanager.prototype.deps = function (fn, params) {
    var me = this
      ;

    if (params.builtIns) {
      // ignore
    } else if ('browser' === params.environment) {
      params.builtIns = browserNatives;
    } else if ('node') {
      params.builtIns = nodeNatives;
    } else {
      if (fn) { fn(new Error("environment wasn't 'browser' or 'node'")); }
      return;
    }

    if (params.packageRoot) {
      me._packageRoot = params.packageRoot;
    }

    pakman.makePackageReady(me._packageRoot, params.builtIns, function (err, pkg, missing, unlisted, unused, local, pm, builtin) {
      logDeps(err, pkg, missing, unlisted, unused, local, pm, builtin);
      displayResults(err, pkg, missing, unlisted, unused, local, pm, builtin);
      if (fn) { fn(); }
    });
  };

  // Instance preserved for backwards-compat
  Pakmanager.prototype.create = Pakmanager.create;
  module.exports = Pakmanager.create();
}());
