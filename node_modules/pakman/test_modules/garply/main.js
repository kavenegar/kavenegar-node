(function () {
  "use strict";

  require('./lib/one');
  require('./lib/four');
  require('./lib/two/three');
  require('garply/two');

  console.log('garply');
})
