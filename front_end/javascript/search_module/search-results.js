var SearchResults = class SearchResults {
  constructor(mainDiv) {
    this.mainDiv = mainDiv;
    this.loadNavbar(mainDiv);
    this.displayResults(mainDiv, $(mainDiv).find('.video-results'), $(mainDiv).find('.post-results'));
  }

  loadNavbar(mainDiv) {
    require(['navbar'], function () {
      var divToLoad = $(mainDiv).find("#navbox");
      loadComponent("MenuModule", divToLoad, function () {
        new NavBarLoggedInCourse(divToLoad, 123);
      });
    });
  }

  displayResults(mainDiv, videoDiv, postDiv) {
    callAPI('/fake_data/searchResults.json', 'GET', {}, (data) => {
      var query = data['Query'];
      var course_title = data['Title'];
      var video_results = data['Videos'];

      $(mainDiv).find('.user-query').textContent = query;
      $(mainDiv).find('.course-results-name').textContent = course_title;

      var curr_row;
      for(var i = 0, len = video_results.length; i < len; i++) {
        if(i % 3 === 0) {
          var row = document.createElement('div');
          $(row).addClass('video-result-row row');
          $(videoDiv).append(row);
          curr_row = row;
        }

        var video_result = video_results[i];
        var video_result_div = document.createElement('div');
        $(video_result_div).addClass('video-result col-sm-4');

        var video_preview_img = document.createElement('img');
        video_preview_img.src = video_result['PreviewImage'];
        $(video_preview_img).addClass('preview-img');

        $(video_result_div).append(video_preview_img);

        $(curr_row).append(video_result_div);
      }
    });
  }

  loadPosts (thisClass) {
    require(['postSearch'], function () {
      var divToLoad = $(thisClass.mainDiv).find("#posts");
      loadComponent("PostSearchModule", divToLoad, function () {
        console.log(thisClass.mainDiv);
        console.log("postSearch");
        new PostSearch({
          "UniqueID": thisClass.podcastID,
          "TypeOfFetch": "CourseSearch",
          "SearchQuery" : "Supply"
        },
        {
          "Name": thisClass.UserName,
          "Pic": thisClass.UserPic
        }, divToLoad);
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
}
