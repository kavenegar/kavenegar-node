/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  // can only find requires that look like require("somestring"), not require("string" + var)
  var reFindRequires = /\brequire\s*\(['"](.*?)['"]\)/g
    , removeComments = require('./remove-comments')
    ;

  function getRequires(str) {
    var match
      , dependsOn = []
      ;   

    str = removeComments(str);

    // WARN: beware this nasty trick; RegExp stores state until you
    // use a different string or all possible matches have been matched
    // http://www.regular-expressions.info/javascript.html
    while (match = reFindRequires.exec(str)) {
      dependsOn.push(match[1]);
    }   

    return dependsOn;
  }

  module.exports.getRequires = getRequires;
}());
