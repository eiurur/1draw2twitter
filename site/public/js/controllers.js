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
  .controller('UserCtrl', function ($scope, $http, $location, $rootScope) {
    console.log("UserCtrl");
  })
  .controller('AdminUserCtrl', function ($scope, $http, $location, $rootScope, AuthenticationService) {
    console.log("AdminUserCtrl");

    $scope.isAuthenticated = AuthenticationService.isAuthenticated;


    if (!AuthenticationService.isAuthenticated) {

      // セッションを問い合わせ
      $http.get('/api/isAuthenticated')
        .success(function(data) {
          // var id = data.data.id;

          console.log("AdminUserCtrl isAuthenticated  data = ", data);
          console.log("AdminUserCtrl isAuthenticated  data.data = ", data.data);
          if(!_.isNull(data.data)) {
            console.log("AdmiUser Ctrl isAuthenticattied false --> true");
            AuthenticationService.isAuthenticated = true;
            $scope.isAuthenticated = AuthenticationService.isAuthenticated;

            console.log(data.data);
            $scope.user = data.data;
          }

      }).error(function(status, data) {

        console.log(status);
        console.log(data);

      });
    }

  }).controller('RoomCtrl', function ($scope, $http, $location, $rootScope, $routeParams, AuthenticationService) {
    console.log("RoomCtrl");

    var nowDate = moment().format("YYYY-MM-DD");

    $scope.isFinished = false;
    $scope.width = 640;
    $scope.height = 480;
    $scope.penColor = '#1F2138';
    $scope.lineWidth = 2;

    $http.get('/api/findRoomByID/' + $routeParams.id)
      .success(function(data){
        console.log(data);
        $scope.room = data.data[0];

        getNewPosts();
      });


    $scope.convertToImage = function() {
      var canvas = document.getElementById("myCanvas");
      $scope.workURL = canvas.toDataURL();
      $scope.isFinished = true;
      $http.get('/api/findUserByID/' + $scope.$parent.user.id)
        .success(function(user) {
          console.log("findUserByID = ", user.data);
          $http.post('/api/saveImage', {
              url: $scope.workURL
            , tagID: $scope.room.tag._id
            , userID: user.data._id
          }).success(function(data) {
            console.log('saveImege success');
            getNewPosts();
          });
        });
    }

    function getNewPosts() {

      // 新着イラスト問い合わせ
      $http.get('/api/findPostsByTagAndDate/' + $scope.room.tag._id + '/' + nowDate)
        .success(function(post){
          console.log(post);
          $scope.posts = post.data;
        });

      // ランキング問い合わせ
      $http.get('/api/findRankingByTagAndDate/' + $scope.room.tag._id + '/' + nowDate)
        .success(function(post){
          console.log(post);
          $scope.rankingPosts = post.data;
        });
    }
  });

