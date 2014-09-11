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

  # �_�ߤ���r�̤�30��ǰ�Υ����������

  # ���}��������ȡ��

  # �������ɤ�������ָ��(Ş�����3�ˤ�����3����֥饤�֤ϥ����e����˥åȄe��ѧ��e�ʤɤʤɤ�1)

  # ��֪
  # TagProvider.find (err, tags) ->
  #   console.log 'TagProvider data ->', tags
    # tags.forEach (tag) ->
    #   themes = []
    #   themes = _.findWhere tags, {id: tag.id}
    #   for i in [1..themes.numPresentation]
    #     theme = themes.themes[Math.floor(Math.random() * themes.themes.length)]
    #     ThemeProvider.save

    #     console.log theme

    # �Ʃ`�ޤ��ϕ�����׷�Ӥ��ʤ��褦�ʄI��򤳤���ӛ��

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
