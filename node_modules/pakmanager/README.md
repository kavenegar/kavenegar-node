pakmanager
===

An example (and fully functional) package manager built on the [`pakman`](http://github.com/coolaj86/node-pakman) and `npm` APIs.

Installation
===

If you haven't already set your NPM author info, now you should:

    npm set init.author.name "Your Name"
    npm set init.author.email "you@example.com"
    npm set init.author.url "http://yourblog.com"

    npm adduser

And install pakmanager:

    npm install -g pakmanager

Usage
===

In short: run `pakmanager build` wherever `package.json` exists

Create your project

    PROJECT=~/Code/some-project
    mkdir -p ${PROJECT}/lib
    cd ${PROJECT}
    touch lib/index.js
    npm init

NOTE: Your code will be wrapped in a strict-mode closure - so don't use "The Bad Parts" TM such as using `this` to refer to the global object. See [jshint](http://jshint.com).

    (function () { "use strict";
      var module = { exports: {} };
      /*** your code pasted here ***/ 
      provide('providename', module);
    }());

Mark as private if need be by editing `package.json` and adding `"private": true,`

Test and build your module

    pakmanager deps
    pakmanager build
    # edit pakmanaged-test.js
    # open pakmanaged.html to see about any errors

And you might want to publish your module

    npm publish ./


CLI / API
===

    pakmanager deps       # list all dependencies
    pakmanager build      # builds package.json.browserDependencies and package.json.main

    rm -rf pakmanaged.js ./node_modules # clean old builds

Internal API
===

    #create(config)
    #init(cb, config)

    config.packageRoot

TODO
===

linting

jshint code and report errors

Add to API

    pakmanager init       # creates / updates package.json
    pakmanager install    # installs package.json.browserDependencies into ./node_modules
    pakmanager clean      # rm -rf ./node_modules
    pakmanager rebuild    # clean, build
    pakmanager add        # add module@ver to package.json.browserDependencies
    pakmanager set        # set module@ver in package.json.browserDependencies
