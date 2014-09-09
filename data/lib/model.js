(function() {
  var Fav, FavProvider, FavSchema, InitProvider, ObjectId, Post, PostProvider, PostSchema, Room, RoomProvider, RoomSchema, Schema, Tag, TagProvider, TagSchema, Theme, ThemeProvider, ThemeSchema, User, UserProvider, UserSchema, db, mongoose, uri;

  mongoose = require('mongoose');

  uri = process.env.MONGOHQ_URL || 'mongodb://127.0.0.1/1draw2twitter';

  db = mongoose.connect(uri);

  Schema = mongoose.Schema;

  ObjectId = Schema.ObjectId;

  FavSchema = new Schema({
    postID: {
      type: Schema.Types.ObjectId,
      index: true
    },
    userID: {
      type: Schema.Types.ObjectId
    },
    createdAt: Date
  });

  PostSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    },
    favs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Fav'
      }
    ],
    favNum: {
      type: Number,
      "default": 0
    },
    retweetNum: {
      type: Number,
      "default": 0
    },
    fileType: {
      type: String
    },
    createdDate: Date,
    createdAt: Date
  });

  RoomSchema = new Schema({
    id: {
      type: String,
      unique: true
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    },
    active: {
      type: Number,
      "default": 0
    },
    startedAt: String
  });

  TagSchema = new Schema({
    id: String,
    word: {
      type: String,
      unique: true
    }
  });

  ThemeSchema = new Schema({
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    },
    word: String
  });

  UserSchema = new Schema({
    id: {
      type: String,
      unique: true
    },
    name: String,
    screenName: String,
    description: String,
    icon: String,
    url: String,
    createdAt: Date
  });

  mongoose.model('Fav', FavSchema);

  mongoose.model('Post', PostSchema);

  mongoose.model('Room', RoomSchema);

  mongoose.model('Tag', TagSchema);

  mongoose.model('Theme', ThemeSchema);

  mongoose.model('User', UserSchema);

  Fav = mongoose.model('Fav');

  Post = mongoose.model('Post');

  Room = mongoose.model('Room');

  Tag = mongoose.model('Tag');

  Theme = mongoose.model('Theme');

  User = mongoose.model('User');

  InitProvider = (function() {
    function InitProvider() {}

    InitProvider.prototype.save = function(params, callback) {
      var tag;
      console.log("\n============> Init\n");
      tag = new Tag({
        id: params.tag.id,
        word: params.tag.word
      });
      return tag.save(function(err) {
        var room;
        room = new Room({
          id: params.id,
          tag: tag._id,
          startedAt: params.startedAt
        });
        return room.save(function(err) {
          return callback(err);
        });
      });
    };

    return InitProvider;

  })();

  FavProvider = (function() {
    function FavProvider() {}

    FavProvider.prototype.findByPostIDAndUserID = function(params, callback) {
      console.log("\n============> FavProvider findByPostIDAndUserID\n");
      return Fav.find({
        '$and': [
          {
            postID: params.postID,
            userID: params.userID
          }
        ]
      }).populate('post').populate('user').exec(function(err, favs) {
        return callback(err, favs);
      });
    };

    FavProvider.prototype.save = function(params, callback) {
      var fav;
      console.log("\n============> FavProvider save\n");
      console.log("FavProvider params ", params);
      fav = new Fav({
        postID: params.postID,
        userID: params.userID,
        createdAt: params.nowTime
      });
      return fav.save(function(err) {
        return callback(err);
      });
    };

    FavProvider.prototype["delete"] = function(params, callback) {
      console.log("\n============> FavProvider delete\n");
      return Fav.find({
        '$and': [
          {
            postID: params.postID,
            userID: params.userID
          }
        ]
      }).remove().exec(function(err) {
        return callback(err);
      });
    };

    return FavProvider;

  })();

  PostProvider = (function() {
    function PostProvider() {}

    PostProvider.prototype.findPostsByTagAndDate = function(params, callback) {
      console.log("\n============> Post findPostsByTagAndDate\n");
      console.log(new ObjectId(params.tagID).path);
      console.log(new ObjectId(params.tagID));
      console.log(params.createdDate);
      return Post.find({
        "$and": [
          {
            'tag': new ObjectId(params.tagID).path,
            'createdDate': params.createdDate
          }
        ]
      }).populate('tag').populate('user').exec(function(err, post) {
        return callback(err, post);
      });
    };

    PostProvider.prototype.findRankingByTagAndDate = function(params, callback) {
      console.log("\n============> Post findRankingByTagAndDate\n");
      return Post.find({
        "$and": [
          {
            'tag': new ObjectId(params.tagID).path,
            'createdDate': params.createdDate
          }
        ]
      }).populate('tag').populate('user').sort({
        favNum: -1
      }).exec(function(err, post) {
        return callback(err, post);
      });
    };

    PostProvider.prototype.findPostsByUserID = function(params, callback) {
      console.log("\n============> Post findPostsByUserID\n");
      return Post.find({
        'user': new ObjectId(params.userID).path
      }).populate('tag').populate('user').sort({
        createdAt: -1
      }).exec(function(err, post) {
        return callback(err, post);
      });
    };

    PostProvider.prototype.save = function(params, callback) {
      var post;
      console.log("\n============> Post save\n");
      console.log(params);
      post = new Post({
        tag: params.tagID,
        user: params.userID,
        fileType: params.fileType,
        createdDate: params.createdDate,
        createdAt: params.createdAt
      });
      return post.save(function(err, post) {
        return callback(err, post);
      });
    };

    PostProvider.prototype.findFavNumByPostID = function(params, callback) {
      return Post.find({
        '_id': params.postID,
        'favNum': 1
      }).exec(function(err, post) {
        return callback(err, post);
      });
    };

    PostProvider.prototype.flucateFavNum = function(params, callback) {
      console.log("flucateNum - " + params.flucateNum);
      return Post.update({
        _id: params.postID
      }, {
        $inc: {
          favNum: params.flucateNum
        }
      }, function(err, numberAffected, favNum) {
        return callback(err, numberAffected, favNum);
      });
    };

    return PostProvider;

  })();

  RoomProvider = (function() {
    function RoomProvider() {}

    RoomProvider.prototype.find = function(callback) {
      console.log("\n============> Room find\n");
      return Room.find({}).populate('tag').exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        console.log('Room find', data);
        return callback(err, data);
      });
    };

    RoomProvider.prototype.findByID = function(params, callback) {
      console.log("\n============> Room findByID\n");
      return Room.find({
        id: params.id
      }).populate('tag').exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        return callback(err, data);
      });
    };

    RoomProvider.prototype.save = function(params, callback) {
      var room, tag;
      console.log("\n============> Room save\n");
      tag = new Tag({
        id: params.tag.id,
        word: params.tag.word
      });
      room = new Room({
        id: params.id,
        tag: tag._id,
        startedAt: params.startedAt
      });
      my.c('room tag._id type = ', typeof room.tag);
      my.c('room tag._id  = ', room.tag);
      return room.save(function(err, data) {
        return callback(err, data);
      });
    };

    return RoomProvider;

  })();

  TagProvider = (function() {
    function TagProvider() {}

    TagProvider.prototype.find = function(params, callback) {
      return console.log("\n============> Tag find\n");
    };

    TagProvider.prototype.save = function(params, callback) {
      var tag;
      console.log("\n============> Tag save\n");
      tag = new Tag({
        id: params.id,
        word: params.word
      });
      return tag.save(function(err) {
        return callback(err, params);
      });
    };

    return TagProvider;

  })();

  ThemeProvider = (function() {
    function ThemeProvider() {}

    ThemeProvider.prototype.find = function(params, callback) {
      return console.log("\n============> Theme find\n");
    };

    return ThemeProvider;

  })();

  UserProvider = (function() {
    function UserProvider() {}

    UserProvider.prototype.findOne = function(params, callback) {
      console.log("\n============> User findOne\n");
      return User.findOne({
        id: params.id
      }, function(err, user) {
        return callback(err, user);
      });
    };

    UserProvider.prototype.findUserByID = function(params, callback) {
      console.log("\n============> User findUserByID\n");
      return User.findOne({
        id: params.id
      }, function(err, user) {
        return callback(err, user);
      });
    };

    UserProvider.prototype.save = function(params, callback) {
      var user;
      console.log("\n============> User save\n");
      console.log(params);
      console.log(params.profile._json.params_image_url_https);
      user = new User({
        id: params.profile.id,
        name: params.profile.username,
        screenName: params.profile.displayName,
        description: params.profile._json.description,
        icon: params.profile._json.profile_image_url_https,
        url: params.profile._json.url
      });
      return user.save(function(err) {
        return callback(err, user);
      });
    };

    UserProvider.prototype.upsert = function(params, callback) {
      var user;
      console.log("\n============> User upsert\n");
      console.log(params);
      user = {
        id: params.profile.id,
        name: params.profile.username,
        screenName: params.profile.displayName,
        description: params.profile._json.description,
        icon: params.profile._json.profile_image_url_https,
        url: params.profile._json.url
      };
      return User.update({
        id: params.profile.id
      }, user, {
        upsert: true
      }, function(err) {
        return callback(err);
      });
    };

    return UserProvider;

  })();

  exports.InitProvider = new InitProvider();

  exports.FavProvider = new FavProvider();

  exports.PostProvider = new PostProvider();

  exports.RoomProvider = new RoomProvider();

  exports.TagProvider = new TagProvider();

  exports.ThemeProvider = new ThemeProvider();

  exports.UserProvider = new UserProvider();

}).call(this);