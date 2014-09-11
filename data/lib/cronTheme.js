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
      console.log('TagProvider tag = ', tag[0]);
      console.log('TagProvider _.has tag[0],  = ', _.has(tag[0], '_id'));
      console.log('TagProvider tag[0]._id = ', tag[0]._id);
      console.log("TagProvider.findByID themes = ", themes);
      return ThemeProvider.update({
        tagID: tag[0]._id,
        words: themes
      }, function(err, theme) {
        if (err) {
          return console.log(err);
        }
      });
    });
  };

}).call(this);
