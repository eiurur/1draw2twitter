// 'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('InitCtrl', function ($scope, $http, $location, $rootScope) {
    console.log("InitCtrl");
    $http.post('/api/init')
      .success(function(data) {
        console.log('init success');
      });
  })
  .controller('IndexCtrl', function ($scope, $http, $location, $rootScope) {
    console.log("IndexCtrl");
    $http.get('/api/findRooms')
      .success(function(data) {
        // $scope.rooms = data.data;
        $scope.rooms = _.map(data.data, function(room) {
          room.idToUpper = room.id.charAt(0).toUpperCase() + room.id.substring(1).toLowerCase();
          room.endedAt = moment(room.startedAt, "HH:mm").add(10, 'm').format('HH:mm');
          return room;
        });
      });
  })
  .controller('UserCtrl', function ($scope, $http, $location, $timeout, $rootScope, $routeParams) {
    console.log("UserCtrl");

    // ユーザの過去のイラストを全て問い合わせ
    $http.get('/api/findPostsByUserID/' + $routeParams.id)
      .success(function(post){
        $scope.posts = post.data;
        console.log("User Ctrl posts = ", $scope.posts);
        console.log("$routeParams.id = ", $routeParams.id);

        var length = post.data.length;
        var index = 0;
        var process = function() {
          for (; index < length;) {
            $scope.posts[index].isFav = false;
            if(_.findWhere($scope.posts[index].favs, {userID: $routeParams.id})) $scope.posts[index].isFav = true;
            $timeout(process, 5);
            index++;
            break;
          }
        };
        process();
      });
  })
  .controller('AdminUserCtrl', function ($scope, $http, $location, $rootScope, $routeParams, FavService, AuthenticationService) {
    console.log("AdminUserCtrl");

    $scope.isAuthenticated = AuthenticationService.isAuthenticated;


    if (!AuthenticationService.isAuthenticated) {

      // セッションを問い合わせ
      $http.get('/api/isAuthenticated')
        .success(function(data) {
          if(!_.isNull(data.data)) {
            AuthenticationService.isAuthenticated = true;
            $scope.isAuthenticated = AuthenticationService.isAuthenticated;

            console.log(data.data);
            $scope.user = data.data;
            $http.get('/api/findUserByID/' + $scope.user.id)
              .success(function(data) {

               // ユーザ個別ページの判定用IDはtwitterIDではなく、ObjectIDで行う。
                $scope.user.objectId = data.data._id;
              });
          }
      }).error(function(status, data) {

        console.log(status);
        console.log(data);

      });
    }

  }).controller('RoomCtrl', function ($scope, $http, $location, $timeout, $rootScope, $routeParams, CommonService, AuthenticationService, DrawService) {
    console.log("RoomCtrl");

    var nowDate = moment().format("YYYY-MM-DD");


    // scopeの値は共有しているのでお気に入り数は同期してくれるんだけど
    // class(icon-stared)は個別に付与されるのでタブの使用を中止
    // 代わりにクリックで新着とランキングをトグルする仕様にした。
    $scope.toggleOrderBy = function() {
      $scope.isNewer = !$scope.isNewer;
      $scope.orderProp = ($scope.isNewer) ? "createdAt" : "favNum";
    }

    $http.get('/api/findRoomByID/' + $routeParams.id)
      .success(function(data){
        console.log(data);
        console.log("$scope.$parent.user = ", $scope.$parent);
        $scope.room = data.data[0];

        getPosts();
      });

    /**
     * 新着イラスト問い合わせ
     */
    function getPosts() {
      $http.get('/api/findPostsByTagAndDate/' + $scope.room.tag._id + '/' + nowDate)
        .success(function(post){
          console.log(".post", post.data);
          $scope.posts = post.data;

          if (!AuthenticationService.isAuthenticated) return;
          var length = post.data.length;
          var index = 0;
          var process = function() {
            for (; index < length;) {
              $scope.posts[index].isFav = false;
              if(_.findWhere($scope.posts[index].favs, {userID: $scope.$parent.user.objectId})) $scope.posts[index].isFav = true;
              $timeout(process, 5);
              index++;
              break;
            }
          };
          process();
        });

      // ランキング問い合わせ
      $http.get('/api/findRankingByTagAndDate/' + $scope.room.tag._id + '/' + nowDate)
        .success(function(post){
          console.log(".rankingPost", post.data);
          $scope.rankingPosts = post.data;

          if (!AuthenticationService.isAuthenticated) return;
          var length = post.data.length;
          var index = 0;
          var process = function() {
            for (; index < length;) {
              $scope.rankingPosts[index].isFav = false;
              if(_.findWhere($scope.rankingPosts[index].favs, {userID: $scope.$parent.user.objectId})) $scope.rankingPosts[index].isFav = true;
              $timeout(process, 5);
              index++;
              break;
            }
          };
          process();
        });
      }


    if(AuthenticationService.isAuthenticated) {

      /**
       * お絵かきサイド
       */
      var canvas, ctx, ctxProxy;


      var drawing = false;

      var lastX
        , lastY
        , currentX
        , currentY
        , strokeHistory = []
        , strokeHistories = []
        , strokeStacks = []
        ;


      $scope.isFinished = false;
      $scope.width = 640;
      $scope.height = 480;
      $scope.penType = 'brush';
      $scope.penColor = '#1F2138';
      $scope.opacity = 1;
      $scope.lineWidth = 4;
      $scope.isNewer = true;
      $scope.orderProp = "createdAt";
      $scope.tweet = '';

      $scope.colors = DrawService.colors;

      _.defer(function(){

        // ユーザが見る方
        canvas = $('#myCanvas');

        // ユーザが描く方
        canvasProxy = $('#myCanvasProxy');
        canvasProxy.addClass({
            'opacity': 1
          , 'cursor': 'default'
        });
        ctx = canvas[0].getContext('2d');;
        ctxProxy = canvasProxy[0].getContext('2d');
        console.log("ctx = ", ctx);
        // 背景色をベタ塗り。これがないと透過背景の画像で保存される。
        clear();

        canvasProxy.bind('mousedown', function(event) {
          if(!_.isUndefined(event.offsetX)) {
            lastX = event.offsetX;
            lastY = event.offsetY;
          } else {
            lastX = event.layerX - event.currentTarget.offsetLeft;
            lastY = event.layerY - event.currentTarget.offsetTop;
          }


          if($scope.penType === 'spoit') {
            var imgDate, r, g, b, rgb, hex, colorCode;
            imgDate = ctx.getImageData(lastX, lastY, 1, 1).data;
            r = imgDate[0];
            g = imgDate[1];
            b = imgDate[2];
            rgb = r + ',' + g + ',' + b;
            hex = rgbToHex(r,g,b);
            colorCode = '#' + hex;
            console.log(colorCode);
            $scope.penColor = colorCode;
            $scope.$apply();
            // $scope.penType = 'brush';
            return;
          }

          strokeStacks = [];
          strokeHistory = [];
          drawing = true;
        });

        canvasProxy.bind('mousemove', function(event) {
          if(!drawing) return;

          if(!_.isUndefined(event.offsetX)) {
            console.log('event.offsetX isUndefined', event);
            currentX = event.offsetX;
            currentY = event.offsetY;
          } else {
            currentX = event.layerX - event.currentTarget.offsetLeft;
            currentY = event.layerY - event.currentTarget.offsetTop;
          }

          draw(lastX, lastY, currentX, currentY);

          lastX = currentX;
          lastY = currentY;

        });

        canvasProxy.bind('mouseup', function(event) {
          if($scope.penType === 'spoit') return;

          console.log(strokeHistory);
          redraw([strokeHistory]);
          ctxProxy.clearRect(0, 0, $scope.width, $scope.height);
          strokeHistories.push(strokeHistory);
          strokeHistory = [];
          drawing = false;
        });

        canvasProxy.bind('mouseleave', function(event) {
          if($scope.penType === 'spoit') return;
          drawing = false;
        });

      });


      /**
       * ng-modelの値を変更
       */
      $scope.updatePenColor = function(penColor) {
        $scope.penColor = penColor;
      }
      $scope.updateOpacity = function(opacity) {
        $scope.opacity = opacity;
        canvasProxy.css('opacity', opacity);
        console.log("canvasProxy = ", canvasProxy);
      }
      $scope.updateLineWidth = function(lineWidth) {
        $scope.lineWidth = lineWidth;
      }


      /**
       * お絵かき処理系
       */
      $scope.penSelect = function(type) {
        // $scope.penType = (type === 'brush') ? 'brush' : 'spoit';
        if(type === 'brush') {
          $scope.penType = 'brush';
          canvasProxy.css('cursor', 'default');
          return;
        }
        $scope.penType = 'spoit';
        canvasProxy.css('cursor', 'crosshair');
      }

      $scope.undo = function() {
        strokeStacks.push(strokeHistories.pop());
        clear();
        redraw(strokeHistories);

      }

      $scope.redo = function() {
        strokeHistories.push(strokeStacks.pop());
        clear();
        redraw(strokeHistories);
      }

      $scope.clearCanvas = function() {
        if(!confirm("作成中のデータは削除されます。\n\nよろしいですか？")) return;

        // TODO: ここ関数化
        strokeStacks = [];
        strokeHistory = [];
        strokeHistories = [];
        clear();
      }


      // ここからspoit処理(外部関数化させるべき、邪魔だ)
      function rgbToHex(R,G,B) {
        return toHex(R)+toHex(G)+toHex(B);
      }

      function toHex(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
      }

      function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
      }

      function draw(lX, lY, cX, cY) {
        ctxProxy.beginPath();
        ctxProxy.lineWidth = $scope.lineWidth;
        console.log("scope.lineWidth = " + $scope.lineWidth);
        console.log("scope.opacity = " + $scope.opacity);
        ctxProxy.lineCap = "round";
        ctxProxy.lineJoin = "round";
        ctxProxy.moveTo(lX, lY);
        ctxProxy.lineTo(cX, cY);
        ctxProxy.strokeStyle = $scope.penColor;
        ctxProxy.stroke();
        ctxProxy.closePath();
        strokeHistory.push({
            penColor: $scope.penColor
          , lineWidth: $scope.lineWidth
          , opacity: $scope.opacity
          , lX: lX
          , lY: lY
          , cX: cX
          , cY: cY
        });
      }

      function clear() {
        ctx.fillStyle = '#FEF4E3';
        ctx.fillRect(0, 0, $scope.width, $scope.height);
        ctxProxy.fillStyle = 'rgba(0,0,0,0)';
        ctxProxy.fillRect(0, 0, $scope.width, $scope.height);
      }

      function redraw(strokeses) {
        ctx.save();
        _.each(strokeses, function(strokes){
          ctx.beginPath();
          _.each(strokes, function(stroke){
            ctx.lineWidth = stroke.lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(stroke.lX, stroke.lY);
            ctx.lineTo(stroke.cX, stroke.cY);
            var color = hexToRgb(stroke.penColor)
            ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + stroke.opacity + ')';
          });
          ctx.stroke();
          ctx.closePath();
        });
        ctx.restore();
      }

      /**
       * 画像に変換
       */
      $scope.convertToImage = function() {

        // いちいち取得しないとcanvasなんてねーよ(undefined)って怒られる。
        var c = document.getElementById("myCanvas");

        // 変換
        $scope.workURL = c.toDataURL();

        // イラストの編集を禁止
        $scope.isFinished = true;

        // tweetにタグとhttpのURLを追加
        $scope.tweet = ' ' + CommonService.siteURL + ' ' + $scope.room.tag.word;

        // postに保存する際に必要なパラメータは
        // 画像のbase64のURL
        // 部屋のタグ(objectId)
        // ユーザのID(ObjectId)
        $http.post('/api/saveImage', {
            url: $scope.workURL
          , tagID: $scope.room.tag._id
          , userID: $scope.$parent.user.objectId
        }).success(function(data) {
          console.log('saveImege success');
          getPosts($scope.$parent.user.objectId);
        });
      }
    }
  }).controller('DrawCtrl', function ($scope, $http, $location, $timeout, $rootScope, $routeParams, CommonService, AuthenticationService, DrawService) {
    console.log("DrawCtrl");

    // $scope.DrawService = DrawService;



  });