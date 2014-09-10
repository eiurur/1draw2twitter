'use strict';

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
        $scope.rooms = data.data;
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

  }).controller('RoomCtrl', function ($scope, $http, $location, $timeout, $rootScope, $routeParams, AuthenticationService) {
    console.log("RoomCtrl");

    var nowDate = moment().format("YYYY-MM-DD");

    $scope.isFinished = false;
    $scope.width = 640;
    $scope.height = 480;
    $scope.penColor = '#1F2138';
    $scope.lineWidth = 2;
    $scope.isNewer = true;
    $scope.orderProp = "createdAt";

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

        getPosts($scope.$parent.user.objectId);
      });

    /**
     * 画像に変換
     */
    $scope.convertToImage = function() {
      var canvas = document.getElementById("myCanvas");

      // 変換
      $scope.workURL = canvas.toDataURL();

      // イラストの編集を禁止
      $scope.isFinished = true;

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

    /**
     * 新着イラスト問い合わせ
     */
    function getPosts(userID) {
      $http.get('/api/findPostsByTagAndDate/' + $scope.room.tag._id + '/' + nowDate)
        .success(function(post){
          console.log("userID ", userID);
          console.log(".post", post.data);
          $scope.posts = post.data;

          var length = post.data.length;
          var index = 0;
          var process = function() {
            for (; index < length;) {
              $scope.posts[index].isFav = false;
              if(_.findWhere($scope.posts[index].favs, {userID: userID})) $scope.posts[index].isFav = true;
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

          var length = post.data.length;
          var index = 0;
          var process = function() {
            for (; index < length;) {
              $scope.rankingPosts[index].isFav = false;
              if(_.findWhere($scope.rankingPosts[index].favs, {userID: userID})) $scope.rankingPosts[index].isFav = true;
              $timeout(process, 5);
              index++;
              break;
            }
          };
          process();
        });
    }
  });

