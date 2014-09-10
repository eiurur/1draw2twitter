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
  .directive('drawing', [ 'DrawService', function (DrawService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var canvas = element[0];
        var ctx = canvas.getContext('2d');

        var drawing = false;

        var lastX
          , lastY
          , currentX
          , currentY
          ;


        // 背景色をベタ塗り。これがないと透過背景の画像で保存される。
        _.defer(function(){
          clear();
        });

        element.bind('mousedown', function(event) {
          if(_.isUndefined(event.offsetX)) {
            lastX = event.offsetX;
            lastY = event.offsetY;
          } else {
            lastX = event.layerX - event.currentTarget.offsetLeft;
            lastY = event.layerY - event.currentTarget.offsetTop;
          }

          ctx.beginPath();

          drawing = true;
        });

        element.bind('mousemove', function(event) {
          if(!drawing) return;

          if(!_.isUndefined(event.offsetX)) {
            console.log('event.offsetX isUndefined', event);
            currentX = event.offsetX;
            currentY = event.offsetY;
          } else {
            currentX = event.layerX - event.currentTarget.offsetLeft;
            currentY = event.layerY - event.currentTarget.offsetTop;
          }
          // DrawService.history.saveState(canvas);

          draw(lastX, lastY, currentX, currentY);

          lastX = currentX;
          lastY = currentY;

        });

        element.bind('mouseup', function(event) {
          drawing = false;
        });

        element.bind('mouseleave', function(event) {
          drawing = false;
        });

        function reset() {
          element[0].width = element[0].width;
        }

        function draw(lX, lY, cX, cY) {
          ctx.lineWidth = attrs.lineWidth;
          ctx.globalAlpha = attrs.opacity;
          console.log("scope.lineWidth = " + attrs.lineWidth);
          console.log("scope.opacity = " + attrs.opacity);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(lX, lY);
          ctx.lineTo(cX, cY);
          ctx.strokeStyle = attrs.penColor;
          ctx.stroke();
        }

        function clear() {
          ctx.fillStyle = '#FEF4E3';
          ctx.fillRect(0, 0, attrs.width, attrs.height);
        }


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