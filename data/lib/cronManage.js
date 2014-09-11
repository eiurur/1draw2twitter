(function() {
  var TagProvider, cronTheme, moment, my, settings, _;

  _ = require('lodash');

  moment = require("moment");

  my = require('./my').my;

  TagProvider = require('./model').TagProvider;

  cronTheme = require('./cronTheme').cronTheme;

  settings = process.env.NODE_ENV === "production" ? require("./production") : require("./development");

  exports.cronManage = function() {
    return settings.CATEGORIES.forEach(function(category) {
      var i, themes, _i, _ref;
      console.log('cateogry', category);
      themes = [];
      for (i = _i = 1, _ref = category.numPresentation; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        themes.push(my.random(category.themes));
        console.log('themes rand -> ', themes);
      }
      return cronTheme(my.createHash(category.tag, 'md5'), themes);
    });
  };

}).call(this);
