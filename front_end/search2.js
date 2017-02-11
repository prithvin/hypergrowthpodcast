// 'use strict'
//
// class searchResults{
//
//   printStuff(){
//     this.printArray.push("hi")
//     console.log("fsdfsdfsdfsdfs")
//   }
//
// }
//
// export default [searchResults]

var app = angular.module('podcast', []);

app.controller('MainCtrl', [
'$scope', function($scope){
  $scope.test = 'Hello world!';
  $scope.flag = 0;
  console.log($scope.flag);
  $scope.pods = []
  $scope.chunkedArray = [];
  counter = 0;

  $scope.add = function(){
    $scope.flag = 1;
    counter++;
    $scope.pods.push(counter)
    $scope.chunk($scope.pods, $scope.pods.length)
    console.log("pods length is: " + $scope.pods.length)
    console.log("chunkedArray length is" + $scope.chunkedArray.length)
  }

  $scope.chunk = function(array, size){
    for (var i = 0; i < array.length; i+=size){
      $scope.chunkedArray.push(array.slice(i, i+size));
    }
  }

  // $scope.posts = [
  //   {title: 'post1', upvotes: 5},
  //   {title: 'post2', upvotes: 2},
  //   {title: 'post3', upvotes: 15},
  //   {title: 'post4', upvotes: 4},
  //   {title: 'post5', upvotes: 20},
  //   {title: 'post6', upvotes: 12},
  //   {title: 'post7', upvotes: 10},
  //   {title: 'post8', upvotes: 3}
  // ];
  //
  // $scope.addResult = function(){
  //   if (!$scope.title || $scope.title === '') {return;}
  //   $scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
  //   $scope.title = '';
  //   $scope.link = '';
  // };
  //
  // $scope.increment = function(post){
  //   console.log("HIiiiiiiiiiiiiiii")
  //   post.upvotes += 1;
  // }

}]);
