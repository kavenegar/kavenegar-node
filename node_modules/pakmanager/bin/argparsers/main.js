/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  exports.create = function (parser) {

    parser.addArgument(
        ["-e", "--environment"]
      , {
            help: "Explicitly compile packages for 'browser' or 'node' rather than guessing"
          , metavar: "<browser|node>"
          , defaultValue: "guess"
        }
    );

    parser.addArgument(
        [ '-c', '--change-dir' ]
      , {
            action: 'store'
          , type: 'string'
          , metavar: 'DIR'
          , help: 'change the current working directory to DIR'
        }
    );

  };
}());
