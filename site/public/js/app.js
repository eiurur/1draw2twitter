'use strict';

angular.module('myApp', [
  'ngRoute',
  // 'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: 'IndexCtrl'
    }).
    when('/logout', {
      redirectTo: '/'
    }).
    when('/room/:id', {
      templateUrl: 'partials/room',
      controller: 'RoomCtrl'
    }).
    when('/test', {
      templateUrl: 'partials/test',
      controller: 'UserCtrl'
    }).
    when('/init', {
      templateUrl: 'partials/init',
      controller: 'InitCtrl'
    }).
    when('http://127.0.0.1:9012/auth/twitter/callback', {
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});

