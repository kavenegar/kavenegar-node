#!/usr/bin/env node
/*jshint strict:true node:true es5:true onevar:true laxcomma:true laxbreak:true eqeqeq:true immed:true latedef:true*/
(function () {
  "use strict";

  var ArgumentParser = require('argparse').ArgumentParser
    , parser
    , subparsers
    , args
    ;

  parser = new ArgumentParser({
      version: require('../package.json').version
    , addHelp: true
    , descriptions: require('../package.json').description
  });

 require('./argparsers/main').create(parser);

  subparsers = parser.addSubparsers({
    title:'subcommands',
    dest:"subcommand_name"
  });

  // pakmanager build
  require('./argparsers/build').create(subparsers.addParser('build',
      {
          addHelp: true
        , aliases: ['b']
      }
  ));

  // pakmanager deps
  require('./argparsers/deps').create(subparsers.addParser('deps',
      {
          aliases: ['d']
        , addHelp: true
      }
  ));

  // pakmanager add
  /*
  parser.addArgument(
      ['anonymous']
    , {
          metavar: "N"
        , type: 'string'
        , nargs: '*'
        , help: "some parameters"
      }
  );
  //*/

 exports.parse = function () {
    return parser.parseArgs();
  };
}());
