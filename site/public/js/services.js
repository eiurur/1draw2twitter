'use strict';

/* Services */

angular.module('myApp.services', [])
  .service('CommonService', function() {
    var coommon = {
        siteURL: 'http://gochiusa.com'
    }
    return coommon;
  })
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

  })
  .service('DrawService', function($http) {
    // return {

    //     history: {
    //       redoList: [],
    //       undoList: [],
    //       saveState: function(canvas, list, keepRedo) {
    //         keepRedo = keepRedo || false;
    //         if(!keepRedo) {
    //           this.redoList = [];
    //         }

    //         (list || this.undoList).push(canvas.toDataURL());
    //       },
    //       undo: function(canvas, ctx) {
    //         console.log("dire undo");
    //         console.log("undo undoList = ", this.undoList);
    //         this.restoreState(canvas, ctx, this.undoList, this.redoList);
    //       },
    //       redo: function(canvas, ctx) {
    //         console.log("dire redo");
    //         console.log("redo redoList = ", this.redoList);
    //         this.restoreState(canvas, ctx, this.redoList, this.undoList);
    //       },
    //       restoreState: function(canvas, ctx,  pop, push) {
    //         if(pop.length) {
    //           this.saveState(canvas, push, true);
    //           var _restoreState = pop.pop();
    //           console.log("dir _restoreState", _restoreState);
    //           var img = document.createElement('img');
    //           img.src = _restoreState;
    //           // var img = new Element('img', {'src':_restoreState});
    //           img.onload = function(width, height) {
    //             ctx.clearRect(0, 0, width, height);
    //             ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
    //           }
    //         }
    //       }
    //     }

    // };

    var common = {
        colors: [
          '#000000', '#808080', '#EDEDED'
        , '#FFFFFF', '#FEF4E3', '#1F2138'
        , '#FF3B21', '#FFBD16', '#F5F30F'
        , '#A5E975', '#71DBFD', '#FA80F9'
        , '#8E0000', '#FFCC99', '#877D30'
        , '#008F47', '#313BCD', '#C02E97'
        , '#3F037E']
      , width: 640
      , height: 480
      , opacity: 1
      , lineWidth: 4
    }
    return common;
  })
  .service('PostService', function($http) {
    return {
      deletePostByID: function(postID, userID, userObjectID) {
        return  $http.post('/api/deletePostByID/', {postID: postID, user: {id: userID, objectID: userObjectID}});
      }
    };

  });
