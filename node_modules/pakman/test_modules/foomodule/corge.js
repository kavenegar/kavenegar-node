(function () {
  "use strict";

  console.log('corge');

  var epsilon
    , pepsilon
    ;

  try {
    epsilon = require('./doesnt-exist');
    pepsilon = require('test-local-deps/also/doesnt-exist');
  } catch(e) {
    console.log('don\'t exist');
  }
}());
