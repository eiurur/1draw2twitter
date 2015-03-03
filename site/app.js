exports.serve = function() {

  /**
   * Module dependencies
   */

  var express         = require('express')
    , bodyParser      = require('body-parser')
    , methodOverride  = require('method-override')
    , morgan          = require('morgan')
    , cookieParser    = require('cookie-parser')
    , session         = require('express-session')
    , MongoStore      = require('connect-mongo')(session)
    , passport        = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy
    , routes          = require('./routes')
    , api             = require('./routes/api')
    , http            = require('http')
    , path            = require('path')
    , UserProvider    = require('../data/lib/model').UserProvider
    , settings        = process.env.NODE_ENV === "production" ? require("../data/lib/production") : require("../data/lib/development")
    ;

  var app = module.exports = express();
  // var server = http.createServer(app);
  // var io = require('socket.io').listen(server);

  var env = process.env.NODE_ENV || 'development';

  // development only
  if (env === 'development') {
    app.locals.pretty = true;
  }

  // production only
  if (env === 'production') {
  }

  /**
   * passport
   */
  // Passport sessionのセットアップ
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // PassportでTwitterStrategyを使うための設定
  passport.use(new TwitterStrategy({
    consumerKey: settings.TWITTER_CONSUMER_KEY,
    consumerSecret: settings.TWITTER_CONSUMER_SECRET,
    callbackURL: settings.CALLBACK_URL
  }, function(token, tokenSecret, profile, done) {
      profile.twitter_token = token;
      profile.twitter_token_secret = tokenSecret;
      UserProvider.upsert({
        profile: profile
      }, function(err) {
        return done(null, profile);
      });
    }
  ));

  var options = {
    secret: settings.COOKIE_SECRET,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      "db": "1draw2twitter",
      "host": "127.0.0.1",
      "port": "27017",
      "collection": "sessions",
      "clear_interval": 3600,
      "auto_reconnect": true
    })
  };

  /**
   * Configuration
   */
  // all environments
  app.set('port', process.env.PORT || 9012);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());
  app.use(session(options));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));


  /**
   * Routes
   */
  // Twitterの認証
  app.get("/auth/twitter", passport.authenticate('twitter'));

  // Twitterからのcallback
  app.get("/auth/twitter/callback", passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

  app.get('/logout', routes.logout);

  // serve index and view partials
  app.get('/', routes.index);
  app.get('/partials/:name', routes.partials);

  // JSON API
  app.get('/api/findTags', api.findTags);
  app.get('/api/findRooms', api.findRooms);
  app.get('/api/findRoomByID/:id', api.findRoomByID);
  app.get('/api/findPostsByTagAndDate/:tag/:date', api.findPostsByTagAndDate);
  app.get('/api/findRankingByTagAndDate/:tag/:date', api.findRankingByTagAndDate);
  app.get('/api/findUserByID/:id', api.findUserByID);
  app.get('/api/findPostsByUserID/:id', api.findPostsByUserID);
  app.get('/api/findOnePostByUserID/:id', api.findOnePostByUserID);
  app.get('/api/findByPostIDAndUserID/:postID/:userID', api.findByPostIDAndUserID);

  // init
  app.post('/api/init', api.init);

  // POST
  app.get('/api/isAuthenticated', api.isAuthenticated);
  app.post('/api/saveImage', api.saveImage);
  app.post('/api/toggleFav', api.toggleFav);
  app.post('/api/deletePostByID', api.deletePostByID);
  app.post('/api/tweet', api.tweet);

  // redirect all others to the index (HTML5 history)
  app.get('*', routes.index);


  /**
   * Start Server
   */

  http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
}