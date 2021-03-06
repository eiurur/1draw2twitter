'use strict';

/* Filters */

angular.module('myApp.filters', [])
  // filter('tweetTrimer', function ($sce) {
  //   return function(text) {
  //       if ( !text ){return;}
  //       var tweet = text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&amp;%@!&#45;\/]))?)/,'<a href="$1" target="_blank">$1</a>');
  //       tweet = tweet.replace(/(^|\s)(@|＠)(\w+)/g,'$1<a href="http://www.twitter.com/$3" target="_blank">@$3</a>');
  //       tweet = tweet.replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>');
  //       return $sce.trustAsHtml(tweet);
  //   };
  // })
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })
  .filter('extractionTime', function() {
    return function(items, term) {
      var result = [];
      angular.forEach(items, function(item) {
        if(item.startedDateX >= term) {
          result.push(item);
        }
      });
      return result;
    }
  })
  .filter('firstLetterUpper', function(src) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  })
  .filter('timeago', function(){

    // Source: http://www.jonathanrowny.com/journal/timeago-directive-and-filter-angular-momentjs
    // <span>{{someDate | timeago}}</span>
    return function(date){
      return moment(date).fromNow();
    };
  });
