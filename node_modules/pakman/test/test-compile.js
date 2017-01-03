(function () {
  "use strict";

  var compile = require('../lib/compile').compile
    , render = require('./example-template').render
    , moduleRoot = process.argv[2] || '../test_modules/foomodule'
    ;

  function log(err, string) {
    console.log(string);
  }

  compile(moduleRoot, render, log);
}());
