_        = require 'lodash'
moment   = require "moment"
my       = require('./my').my
TagProvider = require('./model').TagProvider
cronTheme = require('./cronTheme').cronTheme
settings    = if process.env.NODE_ENV is "production"
  require("./production")
else
  require("./development")

exports.cronManage = ->
  settings.CATEGORIES.forEach (category) ->
    # nowTime = moment().format 'HH:mm'
    # startedAt = category.startedAt
    # startedAtBefore30m = moment(startedAt, "HH:mm").add(-30, 'm').format 'HH:mm'
    # return unless startedAtBefore30m < nowTime < startedAt
    console.log 'cateogry', category
    themes = []
    for i in [1..category.numPresentation]
      console.log i
      themes.push my.random(category.themes)
      console.log 'themes rand -> ', themes
    cronTheme my.createHash(category.tag, 'md5'), themes

