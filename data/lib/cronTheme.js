(function() {
  var RoomProvider, TagProvider, ThemeProvider, moment, my, settings, _;

  _ = require('lodash');

  moment = require("moment");

  my = require('./my').my;

  RoomProvider = require('./model').RoomProvider;

  TagProvider = require('./model').TagProvider;

  ThemeProvider = require('./model').ThemeProvider;

  settings = process.env.NODE_ENV === "production" ? require("./production") : require("./development");

  exports.cronTheme = function(categoryID, themes) {
    return TagProvider.findByID({
      id: categoryID
    }, function(err, tag) {
      var nowDate;
      if (tag[0] == null) {
        return;
      }
      nowDate = my.formatYMD();
      return ThemeProvider.upsertThemes({
        tagID: tag[0]._id,
        words: themes,
        heldDate: nowDate
      }, function(err, theme) {
        if (err) {
          return console.log(err);
        }
      });
    });
  };

}).call(this);
