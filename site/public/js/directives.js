'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('description', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
            test
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    };
  })
  .directive('drawing', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        var ctx = element[0].getContext('2d');

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
          console.log(event);
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
            console.log('event.offsetX is undefined', event);
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
          ctx.lineWidth = scope.lineWidth;
          ctx.moveTo(lX, lY);
          ctx.lineTo(cX, cY);
          ctx.strokeStyle = scope.penColor;
          ctx.stroke();
        }

        function clear() {
          ctx.fillStyle = '#FEF4E3';
          ctx.fillRect(0, 0, scope.width, scope.height);
        }


      }
    };
  })
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