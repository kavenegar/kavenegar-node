/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  exports.create = function (parser) {
    parser.addArgument(
        [ '-e', '--env' ]
      , {
            action: 'store'
          , type: 'string'
          , help: 'Explicitly build for browser or NodeJS'
        }
    );
    parser.addArgument(
        ['anonymous']
      , {
            metavar: "N"
          , type: 'string'
          , nargs: '*'
          , help: "some parameters"
        }
    );
    
  };
}());
