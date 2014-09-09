'use strict';

/* Services */

angular.module('myApp.services', [])
  .service('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    }
    return auth;
  })
  .service('FavService', function($http) {
    return {

      findByPostIDAndUserID: function(postID, userID) {
        return  $http.get('/api/findByPostIDAndUserID/' + postID + '/' + userID);
      },
      toggleFav: function(postID, userID) {
        return  $http.post('/api/toggleFav', {postID: postID, userID: userID});
      }

    };

  });
