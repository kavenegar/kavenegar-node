(function () {
  "use strict";

  console.log('foo');

  var bar = require('./bar')
    , foosball
    , document
    ;

  try {
    foosball = require('foosball');
    document = require('document');
  } catch(e) {
    console.log('foosball and document');
  }
}());
