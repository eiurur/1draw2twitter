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

  # �_�ߤ���r�̤�30��ǰ�Υ����������

  # ���}��������ȡ��

  # �������ɤ�������ָ��(Ş�����3�ˤ�����3����֥饤�֤ϥ����e����˥åȄe��ѧ��e�ʤɤʤɤ�1)

  # ��֪

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