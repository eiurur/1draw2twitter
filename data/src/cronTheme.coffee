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

    # ☓ _.has tag[0]._id
    # ○ tag[0]?
    return unless tag[0]?

    nowDate = my.formatYMD()

    # findOneならコールバックのdataにsaveメソッドがあるからそれ使え
    ThemeProvider.upsertThemes
    # ThemeProvider.findByTagID
      tagID: tag[0]._id
      words: themes
      heldDate: nowDate
    , (err, theme) ->
      console.log err  if err
      # if theme.length is 0
      #   theme = new Theme
      #     tag: params.tagID
      #     words: params.words
      #     heldDate: nowDate

      # theme.words = themes
      # theme.save (err, theme) ->
      #   console.log err if err
