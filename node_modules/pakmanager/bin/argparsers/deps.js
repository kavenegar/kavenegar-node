/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  exports.create = function (parser) {
    parser.addArgument(
        [ '--tree' ]
      , {
            action: 'storeTrue'
          , help: 'show the arguments in the more verbose tree view'
        }
    );
  };
}());
