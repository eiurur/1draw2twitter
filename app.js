(function() {
  var async, cronManage, dir, moment, my, s, serve, tasks4startUp, _;

  _ = require('lodash');

  moment = require('moment');

  async = require('async');

  dir = './data/lib/';

  my = require(dir + 'my').my;

  serve = require('./site/app').serve;

  cronManage = require(dir + 'cronManage').cronManage;

  s = process.env.NODE_ENV === "production" ? require("./data/lib/production") : require("./data/lib/development");

  tasks4startUp = [
    function(callback) {
      my.c("■ Server task start");
      serve(null, "Create Server");
      setTimeout((function() {
        return callback(null, "Create! Server\n");
      }), s.GRACE_TIME_SERVER);
    }, function(callback) {
      my.c("■ cronManage task start");
      cronManage(null, "cronManage");
      setTimeout((function() {
        return callback(null, "Done! cronManage\n");
      }), 0);
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
