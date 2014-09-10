var dir           = '../../data/lib/'
  , fs            = require('fs')
  , path          = require('path')
  , crypto        = require('crypto')
  , moment        = require('moment')
  , _             = require('lodash')
  , my            = require(dir + 'my').my
  , FavProvider  = require(dir + 'model').FavProvider
  , PostProvider  = require(dir + 'model').PostProvider
  , RoomProvider  = require(dir + 'model').RoomProvider
  , TagProvider   = require(dir + 'model').TagProvider
  , ThemeProvider = require(dir + 'model').ThemeProvider
  , UserProvider  = require(dir + 'model').UserProvider
  , InitProvider  = require(dir + 'model').InitProvider
  , settings      = process.env.NODE_ENV === "production" ? require("../../data/lib/production") : require("../../data/lib/development")
  ;

/**
 * 要件
 *
 * ・タグ取得
 * ・タグにごとのイラストを取得
 * ・ログイン
 * ・ログアウト
 * ・ユーザプロフィール取得
 * ・ユーザごとのイラスト取得
 * ・イラスト投稿
 * ・
 */


exports.logout = function(req, res) {

  console.log("!_.has前 API sign out req.session = ", req.session);

  if(!_.has(req.session, 'id')) return;

  console.log("API signOut req.session.id = " + req.session.id);


  req.session.destroy();

  console.log("API delete後　signOut req.session", req.sesion);

  res.json({
      data: "ok"
  });

}


exports.findTags = function(req, res) {

  TagProvider.find

  res.json({
      data: "ok"
  });

}


exports.findRooms = function(req, res) {
  RoomProvider.find(function(err, data) {
    if(err) console.log(err);
    // _.each(data, function(room) {
    //   PostProvider.count({
    //       tagID: room.tag.id
    //     ,
    //   }, function(err, num) {

    //   })
    // })

    console.log('api findRooms', data);
    res.json({
        data: data
    });
  });
}


exports.init = function(req, res) {
  console.log('\n============> api init\n');

  _.each(settings.CATEGORIES, function(data) {
    console.log(data);

    InitProvider.save({
        id: data.id
      , tag: {
          id:  my.createHash(data.tag, 'md5')
        , word:  data.tag
      }
      , startedAt: data.startedAt
    }, function(err) {
      if(err) console.log(err);
      res.json({
        data: "ok"
      });
    });

  });
}


exports.findRoomByID = function(req, res) {
  RoomProvider.findByID({
    id: req.params.id || 'lovelive'
  }, function(err, data) {
    console.log("findRoomByID", data);
    res.json({
      data: data
    });
  });
}

// TODO: 下(findRankingByTagAndDate)とほとんど同じだからまとめて
exports.findPostsByTagAndDate = function(req, res) {
  PostProvider.findPostsByTagAndDate({
      tagID: req.params.tag
    , createdDate: req.params.date
  }, function(err, data) {
    res.json({
      data: data
    });
  });
}

exports.findRankingByTagAndDate = function(req, res) {
  PostProvider.findRankingByTagAndDate({
      tagID: req.params.tag
    , createdDate: req.params.date
  }, function(err, data) {
    res.json({
      data: data
    });
  });
}

exports.findUserByID = function(req, res) {
  UserProvider.findUserByID({
    id: req.params.id
  }, function(err, data) {
    console.log("findUserByID", data);
    res.json({
      data: data
    });
  });
}

exports.findPostsByUserID = function(req, res) {
  PostProvider.findPostsByUserID({
    userID: req.params.id
  }, function(err, data) {
    console.log("findPostsByUserID", data);
    res.json({
      data: data
    });
  });
}


exports.isAuthenticated = function(req, res) {

  console.log("isAuthenticated req.session = ", req.session.passport);
  console.log("isAuthenticated req.session.id = " + req.session.id);
  console.log("isAuthenticated _.isUndefined(req.session.passport.user) = ", _.isUndefined(req.session.passport.user));

  var sessionUserData = null;

  if(!_.isUndefined(req.session.passport.user)) {
    sessionUserData = req.session.passport.user;
  }
  res.json({
    data: sessionUserData
  });
}

exports.saveImage = function(req, res) {
  var url     = req.body.url
    , tagID   = req.body.tagID
    , userID  = req.body.userID
    , nowTime = my.formatYMDHms()
    , nowDate = my.formatYMD(nowTime)
    , tagID
    , userID
    ;


  // console.log("saveImage req.body ", req.body);

  // tag._idは$scope.roomに格納されているのでデータベースに問い合わせる必要なし

  PostProvider.save({
      tagID: tagID
    , userID: userID
    , fileType: 'png'
    , createdDate: nowDate
    , createdAt: nowTime
  }, function(err, post) {
    if(err) console.log(err);
    var base64Data =  url.replace(/^data:image\/png;base64,/, "");
    base64Data += base64Data.replace('+', ' ');
    var b = new Buffer(base64Data, 'base64');
    var dirname = path.resolve(__dirname, '../public/blob/');

    // dirname が blob/ で終わっていても、/がないとダメみたいです。
    var saved  = fs.writeFileSync(dirname + '/'+ post._id + '.png', b, 'base64', function(err) {
      console.log(err);
    });
    res.json({
      data: "ok"
    });
  });
}

// イラスト個別ページ用
// /post/:id/
exports.getFavNum = function(req, res) {

  var options = {
    id: req.params.id
  };

  PostProvider.findByID(options, function(err, post) {
    FavProvider.findBy({
      postID: post._id
    }, function(err, favs) {
      res.json({
        data: _.extend(post, {favs: favs.length})
      });
    });
  });
}

// Room, Userページ用
// exports.getFav = function(req, res) {
//   var options = {
//     id:
//   }
// }

exports.findByPostIDAndUserID = function(req, res) {
  FavProvider.findFavNumByPostID({
      postID: req.params.postID
    , userID: req.params.postID
  }, function(err, fav) {
    console.log("API findByPostIDAndUserID fav = ", fav);
    res.json({
      data: fav
    });
  });
}

exports.toggleFav = function(req, res) {
  // すでにお気に入り済みか確認して
  // あればFavテーブルから削除して、なければ追加する
  // その後、PostテーブルのfabNumを±1して、
  // 増やしたらPostテーブルのfavカラムに追加($push)
  // 減らしたらPostテーブルのfavカラムから削除($roll)

  // console.log(req);
  var options = {
      postID: req.body.postID
    , userID: req.body.userID
    , nowTime: my.formatYMDHms()
  };

  var action = null;
  FavProvider.findByPostIDAndUserID(options, function(err, fav) {
    console.log(fav);
    if(!_.isEmpty(fav)) {
      console.log("fav[0]._id", fav[0]._id);
      removeFav();
      pullFav({
          postID: req.body.postID
        , favID: fav[0]._id
      });
      action = 'remove';
    } else {
      createFav();
      action = 'create';
    }
  });

  function removeFav() {
    FavProvider.delete(options, function(err) {
      if(err) console.log(err);
      flucateFav(-1);
    });
  }

  function createFav() {
    console.log(options);
    FavProvider.save(options, function(err) {
      if(err) console.log(err);
      flucateFav(1);
    });
  }

  // Postのファボ数をインクリメント / デクリメント
  function flucateFav(num) {
    PostProvider.flucateFavNum({
        postID: req.body.postID
      , flucateNum: num
    }, function(err) {
      res.json({
        action: action
      });
    });
  }

  // Postテーブルからもfav情報を削除するぞ
  function pullFav(pfOptions) {
    PostProvider.pullFav(pfOptions, function(err) {
      if(err) console.log(err);
    });
  }
}

exports.deletePostByID = function(req, res) {

  console.log(req.session);

  if(req.session.passport.user.id !== req.body.user.id) return;

  // 命名規則が謎
  // usreID = user._id(ObjectID)
  // そもそもObjectIdを直接渡して処理するのが間違いっぽい。
  var options = {
      postID: req.body.postID
    // , userID: req.body.user.objectID
  };
  PostProvider.deleteByID(options, function(err) {
    if(err) console.log(err);

    // ふぁぼデータも一緒に削除。
    FavProvider.deleteByID(options, function(err) {
      if(err) console.log(err);
      res.json({
        data: 'ok'
      });
    });
  });
}

  // req.get '/post/:id', (req, res) ->
  //   Post.findById req.params.id, (err, post) ->
  //     Fav.findBy post_id: post._id, (err, favs) ->
  //       res.json 200, _.extend post,
  //         favs: favs.length # fav数

  // req.post '/post/:post_id/fav', (req, res) ->
  //   Fav.findBy post_id: req.params.post_id, user_id: req.user.id, (err, fav) ->
  //     if fav
  //       fav.remove()
  //     else
  //       fav = new Fav