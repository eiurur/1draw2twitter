'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('favoritable', [ 'FavService', function (FavService) {
    return {
      restrict: 'A',
      scope: {
        num: '='
      },
      link: function(scope, element, attrs) {
        element.on('click', function(event) {
          FavService.toggleFav(attrs.postId, attrs.userObjectId)
            .success(function(data) {
              scope.num += (data.action === 'create') ? 1 : -1;
              element.toggleClass('icon-stared');
            });
        });
      }
    };
  }])
  .directive('deletable', [ 'PostService', function (PostService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        console.log(element);
        element.on('click', function(event) {
          if(!window.confirm('削除してもよろしいですか？')) return;
          PostService.deletePostByID(attrs.postId, attrs.userId, attrs.userObjectId)
            .success(function(data) {
              element.parent().parent().parent().parent().parent().parent().fadeOut(600);
              return function() {
                element.stop();
              }
            });
        });
      }
    };
  }])
  .directive('drawing', [ '$compile', 'DrawService', function ($compile, DrawService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var canvas = element[0];



      }
    };
  }])
  .directive('rooms', function() {
    return {
      restrict: 'E',
      replace: true,
      templete: '<div></div>',
      scope: {
        rooms: '=rooms'
      },
      link: function (scope, elem , attrs) {
        console.log(rooms);
        scope.$watch('rooms', function(rooms) {
          angular.foreach(rooms, function(room) {
            element.append('<h1>' + room + '</h1>');
          });
        });
      }
    };
  })
  .directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        ngSrc: '@'
      },
      link: function(scope, element, attrs) {
        element.on('load', function() {
          element.addClass('in');
        }).on('error', function() {
          //
        });
      }
    };
  }]);