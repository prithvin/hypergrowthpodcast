var SearchPage = class SearchPage {

    constructor (podcastID, mainDiv, searchTerm) {
        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.searchTerm = searchTerm;
        this.loadPosts(this);
        this.loadNavbar(this);
        this.loadVideos(this);

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
                console.log("not resizing");
                $('#myimage').off('click.mynamespace');
            }
            else {
                console.log("resiizing");
                thisClass.updatePostHeights();
            }
        });
    }

    loadNavbar (thisClass) {
        require(['navbar'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#navbox");
            loadComponent("MenuModule", divToLoad, function () {
                var navbar = new NavBarLoggedInCourse(
                    divToLoad,
                    thisClass.podcastID
                );
                navbar.setValueOfSearchBar(thisClass.searchTerm);
            });
        });

    }

    loadPosts (thisClass) {
        require(['postSearch'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#posts");
            loadComponent("PostSearchModule", divToLoad, function () {
                new PostSearch(
                    {
                        "UniqueID": thisClass.podcastID,
                        "TypeOfFetch": "CourseSearch",
                        "SearchQuery" : thisClass.searchTerm
                    },
                    {
                        "Name": thisClass.UserName,
                        "Pic": thisClass.UserPic
                    },
                    divToLoad
                );
                thisClass.dynamicWindowResize(thisClass);
            });
        });
    }

    loadVideos(thisClass) {
      require(['search-videos'], function() {
          console.log("TEST");
        var divToLoad = $(thisClass.mainDiv).find("#search-videos");
        loadComponent("SearchResultsModule", divToLoad, function() {
            new SearchVideosClass(1, $(thisClass.mainDiv));
        });
      });
    }

    updatePostHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#podcast-posts").css("height",newHeight );
        console.log(newHeight);
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
