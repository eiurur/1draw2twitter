(function() {
  var moment, my, s, _;

  _ = require('lodash');

  moment = require("moment");

  my = require('./my');

  s = process.env.NODE_ENV === "production" ? require("./production") : require("./development");

  exports.cronTheme = function() {
    return settings.CATEGORIES.forEach(function(category) {
      var nowTime, startedAt, startedAtBefore30m, themes;
      nowTime = moment().format('HH:mm');
      startedAt = category.startedAt;
      startedAtBefore30m = moment(startedAt, "HH:mm").add(-30, 'm').format('HH:mm');
      if (!((startedAtBefore30m < nowTime && nowTime < startedAt))) {
        return;
      }
      themes = _.findWhere(settings.THEMES, {
        id: category.id
      });
      console.log(themes);
      themes.themes[Math.floor(Math.random() * themes.themes.length)];
      return RoomProvider.setTheme;
    });
  };

}).call(this);
