mongoose = require 'mongoose'
uri      = process.env.MONGOHQ_URL || 'mongodb://127.0.0.1/1draw2twitter'
db       = mongoose.connect uri
Schema   = mongoose.Schema
ObjectId = Schema.ObjectId


##
# Schemaインタフェースを通してモデルの定義を行う
##


FavSchema = new Schema
  postID:
    type: Schema.Types.ObjectId
    index: true
  userID:
    type: Schema.Types.ObjectId
  createdAt: Date

# FavSchema = new Schema
#   postID:
#     type: Schema.Types.ObjectId
#     ref: 'Post'
#     index: true
#   userID:
#     type: Schema.Types.ObjectId
#     ref: 'User'
#   createdAt: type: Date

# ActionStatusSchema = new Schema
#   post:
#     type: Schema.Types.ObjectId
#     ref : 'Post'
#   user:
#     type: Schema.Types.ObjectId
#     ref : 'User'
#   tag:
#     type: Schema.Types.ObjectId
#     ref : 'Tag'
#   isFav:
#     type: Boolean
#     default: 0
#   isRetweet:
#     type: Boolean
#     default: 0
#   createdDate: Date
#   createdAt: Date

PostSchema = new Schema
  user:
    type: Schema.Types.ObjectId
    ref : 'User'
  tag:
    type: Schema.Types.ObjectId
    ref : 'Tag'
  favs: [
    type: Schema.Types.ObjectId
    ref : 'Fav'
  ]
  favNum:
    type: Number
    default: 0
  retweetNum:
    type: Number
    default: 0
  fileType:
    type: String
  createdDate: Date
  createdAt: Date

RoomSchema = new Schema
  id:
    type: String
    unique: true
  tag:
    type: Schema.Types.ObjectId
    ref : 'Tag'
  active:
    type: Number
    default: 0
  startedAt: String
  # postedNum: Number

# id === md5(word)
# word === #ラブライブ版深夜の～
TagSchema = new Schema
  id: String
  word:
    type: String
    unique: true

# word === "BiBi"
ThemeSchema = new Schema
  tag:
    type: Schema.Types.ObjectId
    ref : 'Tag'
  word: String

# id === twitter.data.user.idStr
UserSchema = new Schema
  id:
    type: String
    unique: true
  name: String
  screenName: String
  description: String
  icon: String
  url: String
  createdAt: Date


# ImageScheme = new Schema
#   id: String
#   tag:

# TweetSchema = new Schema


##
# モデルへのアクセス
# mongoose.model 'モデル名', 定義したスキーマクラス
# を通して一度モデルを定義すると、同じ関数を通してアクセスすることができる
##
mongoose.model 'Fav', FavSchema
mongoose.model 'Post', PostSchema
mongoose.model 'Room', RoomSchema
mongoose.model 'Tag', TagSchema
mongoose.model 'Theme', ThemeSchema
mongoose.model 'User', UserSchema
# mongoose.model 'Tweet', TweetSchema


##
# 定義した時の登録名で呼び出し
##
Fav = mongoose.model 'Fav'
Post = mongoose.model 'Post'
Room = mongoose.model 'Room'
Tag = mongoose.model 'Tag'
Theme = mongoose.model 'Theme'
User = mongoose.model 'User'


class InitProvider
  save: (params, callback) ->
    console.log "\n============> Init\n"
    tag = new Tag
      id: params.tag.id
      word: params.tag.word
    tag.save (err) ->
      room = new Room
        id: params.id
        tag: tag._id
        startedAt: params.startedAt
      room.save (err) ->
        callback err

    # postID:
    #   type: Schema.Types.ObjectId
    #   ref : 'Post'
    #   index: true
    # userID:
    #   type: Schema.Types.ObjectId
    #   ref 'User'
    # createdAt: type: Date

class FavProvider

  findByPostIDAndUserID: (params, callback) ->
    console.log "\n============> FavProvider findByPostIDAndUserID\n"
    Fav.find '$and': [
         postID: params.postID
         userID: params.userID
       ]
       .populate 'post'
       .populate 'user'
       .exec (err, favs) ->
         callback err, favs

  save: (params, callback) ->
    console.log "\n============> FavProvider save\n"
    console.log "FavProvider params ", params
    fav = new Fav
      postID: params.postID
      userID: params.userID
      createdAt: params.nowTime
    fav.save (err) ->
      callback err

  delete: (params, callback) ->
    console.log "\n============> FavProvider delete\n"
    Fav.find '$and': [
         postID: params.postID
         userID: params.userID
       ]
       .remove()
       .exec (err) ->
         callback err



class PostProvider
  findPostsByTagAndDate: (params, callback) ->
    console.log "\n============> Post findPostsByTagAndDate\n"
    console.log new ObjectId(params.tagID).path
    console.log new ObjectId params.tagID
    console.log params.createdDate
    Post.find "$and": [
      'tag': new ObjectId(params.tagID).path
      'createdDate': params.createdDate
    ]
    .populate 'tag'
    .populate 'user'
    .exec (err, post) ->
      callback err, post

  findRankingByTagAndDate: (params, callback) ->
    console.log "\n============> Post findRankingByTagAndDate\n"
    Post.find "$and": [
      'tag': new ObjectId(params.tagID).path
      'createdDate': params.createdDate
    ]
    .populate 'tag'
    .populate 'user'
    .sort favNum: -1
    .exec (err, post) ->
      callback err, post

  findPostsByUserID: (params, callback) ->
    console.log "\n============> Post findPostsByUserID\n"
    Post.find 'user': new ObjectId(params.userID).path
        .populate 'tag'
        .populate 'user'
        .sort createdAt: -1
        .exec (err, post) ->
          callback err, post

  save: (params, callback) ->
    console.log "\n============> Post save\n"
    console.log params
    post = new Post
      tag: params.tagID
      user: params.userID
      fileType: params.fileType
      createdDate: params.createdDate
      createdAt: params.createdAt
    post.save (err, post) ->
      callback err, post

  findFavNumByPostID: (params, callback) ->
    Post.find
          '_id': params.postID
          'favNum': 1
        .exec (err, post) ->
          callback err, post

  flucateFavNum: (params, callback) ->
    console.log "flucateNum - " + params.flucateNum
    Post.update _id: params.postID
    ,
      $inc: favNum: params.flucateNum
    , (err, numberAffected, favNum) ->
      callback err, numberAffected, favNum


  # count: (params, callback) ->
  #   console.log  "\n============> Post count\n"
  #   Post.find tag.id: params.tagID
  #        .count()
  #        .exec (err, num) ->
  #          callback(err, num)

class RoomProvider

  find: (callback) ->
    console.log "\n============> Room find\n"
    Room.find {}
        .populate 'tag'
        .exec (err, data) ->
          console.log err  if err
          console.log 'Room find', data
          callback err, data

  findByID: (params, callback) ->
    console.log "\n============> Room findByID\n"
    Room.find id: params.id
        .populate 'tag'
        .exec (err, data) ->
          console.log err  if err
          callback err, data

  save: (params, callback) ->
    console.log "\n============> Room save\n"
    tag = new Tag
      id: params.tag.id
      word: params.tag.word
    room = new Room
      id: params.id
      tag: tag._id
      startedAt: params.startedAt
    my.c 'room tag._id type = ', typeof room.tag
    my.c 'room tag._id  = ', room.tag
    room.save (err, data) ->
      callback err, data


class TagProvider

  find: (params, callback) ->
    console.log "\n============> Tag find\n"

  save: (params, callback) ->
    console.log "\n============> Tag save\n"
    tag = new Tag
      id: params.id
      word: params.word
    tag.save (err) ->
      callback err, params


class ThemeProvider

  find: (params, callback) ->
    console.log "\n============> Theme find\n"


class UserProvider

  findOne: (params, callback) ->
    console.log "\n============> User findOne\n"
    User.findOne id: params.id, (err, user) ->
      callback err, user

  findUserByID: (params, callback) ->
    console.log "\n============> User findUserByID\n"
    User.findOne id: params.id, (err, user) ->
      callback err, user

  save: (params, callback) ->
    console.log "\n============> User save\n"
    console.log params
    console.log params.profile._json.params_image_url_https
    user = new User
      id: params.profile.id
      name: params.profile.username
      screenName: params.profile.displayName
      description: params.profile._json.description
      icon: params.profile._json.profile_image_url_https
      url: params.profile._json.url
    user.save (err) ->
      callback err, user

  upsert: (params, callback) ->
    console.log "\n============> User upsert\n"
    console.log params
    user =
      id: params.profile.id
      name: params.profile.username
      screenName: params.profile.displayName
      description: params.profile._json.description
      icon: params.profile._json.profile_image_url_https
      url: params.profile._json.url
    User.update
      id: params.profile.id
    ,
      user
    , upsert: true
    , (err) ->
      callback err



exports.InitProvider  = new InitProvider()
exports.FavProvider  = new FavProvider()
exports.PostProvider  = new PostProvider()
exports.RoomProvider  = new RoomProvider()
exports.TagProvider   = new TagProvider()
exports.ThemeProvider = new ThemeProvider()
exports.UserProvider  = new UserProvider()
