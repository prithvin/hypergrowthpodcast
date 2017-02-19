var SearchPage = class SearchPage {

    constructor (podcastID, mainDiv) {
        console.log("hiii");
        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.loadPosts(this);

    }

    fetchUserData (thisClass) {
        callAPI("./fake_data/getUser.json", "GET", {}, function (data) {
            thisClass.UserName = data['Name'];
            thisClass.UserPic = data['Pic'];
            thisClass.loadPosts(thisClass);
        });
    }

    dynamicWindowResize (thisClass) {
        $(window).on("resize", function() {
            if ($(thisClass.mainDiv).length == 0) {
                $('#myimage').off('click.mynamespace');
            }
            else {
                thisClass.updatePostHeights();
            }
        });
    }


    loadPosts (thisClass) {
        require(['postSearch'], function () {
            // var divToLoad = $(thisClass.mainDiv).find("#podcast-posts");
          //   loadComponent("MenuModule", #navbox, function () {
          //     new NavBarLoggedInCourse({
          //         firstname: "Rauhmel",
          //         classname: "CSE 110",
          //         classqrtr: "Fall 2017",
          //         userid: "123123123123",
          //         profpic: "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg"
          //     });
          //     $("#navbox").show();
          // }, 200);
          var divToLoad = $(thisClass.mainDiv).find("#post-search");
          loadComponent("PostSearchModule", divToLoad, function () {
              console.log("xxxxxxxxxxxxx");
              new PostSearch(
                  {
                      "UniqueID": thisClass.podcastID,
                      "TypeOfFetch": "PodcastSearch"
                  },
                  {
                      "Name": thisClass.UserName,
                      "Pic": thisClass.Pic
                  },
                  divToLoad
              );
              thisClass.dynamicWindowResize(thisClass);
          });
        });
    }

    updatePostHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#podcast-posts").css("height",newHeight );
    }

};

// var app = angular.module('podcast', []);
//
// app.controller('MainCtrl', [
// '$scope', function($scope){
//   $scope.test = 'Hello world!';
//   $scope.flag = 0;
//   console.log($scope.flag);
//   $scope.pods = []
//   $scope.chunkedArray = [];
//   counter = 0;
//
//   $scope.add = function(){
//     $scope.flag = 1;
//     counter++;
//     $scope.pods.push(counter)
//     $scope.chunk($scope.pods, $scope.pods.length)
//     console.log("pods length is: " + $scope.pods.length)
//     console.log("chunkedArray length is: " + $scope.chunkedArray.length)
//   }
//
//   $scope.chunk = function(array, size){
//     for (var i = 0; i < array.length; i+=size){
//       $scope.chunkedArray.push(array.slice(i, i+size));
//     }
//   }
//
// }]);
