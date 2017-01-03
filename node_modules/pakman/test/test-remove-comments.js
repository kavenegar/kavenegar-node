/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true*/
(function () {
  "use strict";

  var fs = /* delete me */ require('fs') // delete me
// delete me /* and me */ and me
    , path = require('path')
    , removeComments = require('../lib/remove-comments')
    ;


//*/
  /* delete me */
  /*delete me*/
  /* delete // me */
  ///*
  function testStrings() {
    var z = "\""
      , a = "\\"
      , b = "\\\""
      , c = "\\\\"
      , d = "\\\\\""
      , e = "\\\\\\"
      ;
    return "\\/*\/\/";
  }//*/
  /*
   delete me
  //*/


///*
  function testRegexes() {
    var a = /\*/
      , b = /\/*/
      , c = /\\*/
      , d = /\\\/*/
      , e = /\\\\*/
      , f = /\//
      , realUseCase = "".replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"")
                      //.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\
      ;

    return "\\*/" + "\\/*";
  }

  function run() {
    var file = removeComments(fs.readFileSync(process.argv[2] || __filename, 'utf8'))
      ;

    console.log(file)/*deletemeeeeee*/;
  }

  // run this file on itself
  if (require.main === module) {
    run();
  }
}());
