_             = require 'lodash'
moment        = require "moment"
my            = require('./my').my
RoomProvider  = require('./model').RoomProvider
TagProvider   = require('./model').TagProvider
ThemeProvider = require('./model').ThemeProvider
settings      = if process.env.NODE_ENV is "production"
  require("./production")
else
  require("./development")

exports.cronTheme = (categoryID, themes) ->

  # 開催する時刻の30分前のタグがあれば

  # お題をランダムに取得

  # 数は自由に引数で指定(艦これは3人だから3、ラブライブはキャラ別、ユニット別、学年別などなどで1)

  # 告知

  TagProvider.findByID id: categoryID, (err, tag) ->
    console.log 'TagProvider tag = ', tag[0]
    console.log 'TagProvider _.has tag[0],  = ', _.has tag[0], '_id'
    # return unless _.has tag[0], 'id'
    console.log 'TagProvider tag[0]._id = ', tag[0]._id
    console.log "TagProvider.findByID themes = ", themes
    ThemeProvider.update
      tagID: tag[0]._id
      words: themes
    , (err, theme) ->
      console.log err  if err