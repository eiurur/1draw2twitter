(function() {
  var async, dir, moment, my, s, serve, tasks4startUp, _;

  _ = require('lodash');

  moment = require('moment');

  async = require('async');

  dir = './data/lib/';

  my = require(dir + 'my').my;

  serve = require('./site/app').serve;

  s = process.env.NODE_ENV === "production" ? require("./data/lib/production") : require("./data/lib/development");

  tasks4startUp = [
    function(callback) {
      my.c("■ Server task start");
      serve(null, "Create Server");
      setTimeout((function() {
        return callback(null, "Create! Server\n");
      }), s.GRACE_TIME_SERVER);
    }
  ];

  async.series(tasks4startUp, function(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.log("\nall done... Start!!!!\n");
    }
  });

}).call(this);
