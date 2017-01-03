/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var escapeRegExpPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
    ;

  function escapeRegExp(str) {
    return str.replace(escapeRegExpPattern, "\\$&");
  }

  function normalizeScriptRequires(sorted, pkg) {
    sorted.forEach(function (module) {

      function replaceRequire(requireString) {

        var re = new RegExp("\\brequire\\s*\\(\\s*['\"]" + escapeRegExp(requireString)  + "['\"]\\s*\\)", 'g')
          ;

        sorted.forEach(function (moduleb) {

          // TODO doesn't account for cases such as `require(__dirname + '/path/to/submodule')`
          moduleb.scriptSource = moduleb.scriptSource.replace(re, " require('" + module.modulepath + "')");
        });

        module.providespath = module.modulepath;

        if (pkg.provides) {
          module.providespath = module.providespath.replace(pkg.name, pkg.provides);
        }
      }

      Object.keys(module.requiredAs || {}).forEach(replaceRequire);
    });

    if (!pkg.provides) {
      return ;
    }

    /*
      var name = 'foo'
        , provides= 'bar'
        , newScript = " require ( 'foo' ) \n"
                    + ' require ( "foo" ) \n'
                    + " require ( 'foo/corge' ) \n"
                    + ' require ( "foo/corge" ) \n'
                    + ' require ( "foobar" ) \n'
                    + ' require ( "foobar/corge" ) \n'
        ;
    */
    sorted.forEach(function (module) {
      var re
        , name = pkg.name
        , provides = pkg.provides
        , newScript = module.scriptSource
        ;

      re = new RegExp("\\brequire\\s*\\(\\s*'" + escapeRegExp(name)  + "'", 'g');
      newScript = newScript.replace(re, " require('" + provides + "'");

      re = new RegExp("\\brequire\\s*\\(\\s*\"" + escapeRegExp(name)  + '"', 'g');
      newScript = newScript.replace(re, ' require(\"' + provides + '"');

      re = new RegExp("\\brequire\\s*\\(\\s*'" + escapeRegExp(name)  + "\/", 'g');
      newScript = newScript.replace(re, " require('" + provides + "/");

      re = new RegExp("\\brequire\\s*\\(\\s*\"" + escapeRegExp(name)  + "\/", 'g');
      newScript = newScript.replace(re, ' require("' + provides + '/');

      module.scriptSource = newScript;
    });

    return sorted;
  }

  module.exports.normalizeScriptRequires = normalizeScriptRequires;
}());
