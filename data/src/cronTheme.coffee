_        = require 'lodash'
moment   = require "moment"
my       = require('./my').my
RoomProvider = require('./model').RoomProvider
TagProvider = require('./model').TagProvider
ThemeProvider = require('./model').ThemeProvider
settings    = if process.env.NODE_ENV is "production"
  require("./production")
else
  require("./development")

exports.cronTheme = (categoryID, themes) ->

  # 開催する時刻の30分前のタグがあれば

  # お題をランダムに取得

  # 数は自由に引数で指定(艦これは3人だから3、ラブライブはキャラ別、ユニット別、学年別などなどで1)

  # 告知
  # TagProvider.find (err, tags) ->
  #   console.log 'TagProvider data ->', tags
    # tags.forEach (tag) ->
    #   themes = []
    #   themes = _.findWhere tags, {id: tag.id}
    #   for i in [1..themes.numPresentation]
    #     theme = themes.themes[Math.floor(Math.random() * themes.themes.length)]
    #     ThemeProvider.save

    #     console.log theme

    # テーマの上書き、追加しないような処理をここに記述

  # console.log "cronTheme categoryID = ", categoryID
  # console.log "cronTheme themes = ", themes
  TagProvider.findByID id: categoryID, (err, tag) ->
    console.log 'TagProvider tag = ', tag[0]._id
    console.log 'TagProvider _.has tag[0],  = ', _.has tag[0], '_id'
    # return unless _.has tag[0], 'id'
    console.log 'TagProvider tag[0]._id = ', tag[0]._id
    console.log "TagProvider.findByID themes = ", themes
    ThemeProvider.update
      tagID: tag[0]._id
      words: [themes]
    , (err, theme) ->
      console.log err  if err
      # console.log 'ThemeProvider -> theme ', theme
      # RoomProvider.upsertTheme
      #   themeID: theme._id
      # , (err) ->
      #   console.log err  if err

      #   return
