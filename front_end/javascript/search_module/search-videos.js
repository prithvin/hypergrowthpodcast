class SearchVideosClass {
    constructor (courseId, mainDiv, searchTerm) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;

        var masterDiv = $(this.mainDiv).find('#search-videos-div')[0];
        $(this.mainDiv).find("#title").html("Here are some videos we found about \"" + searchTerm + "\"");

        this.keywordLoadFromCrud(searchTerm, courseId, masterDiv);

        callAPI("fake_data/searchResults.json", "GET", {}, function(data) {

          var overallDiv = $(this.mainDiv).find(".videos-div")[0];
          overallDiv.style="overflow-y:scroll; overflow-x:hidden; height:66%";
          masterDiv.appendChild(overallDiv);
          overallDiv.class = 'scroll';

          var row = document.createElement('div');
          row.className = 'row';
          row.style="height:284px";
          overallDiv.appendChild(row);

          var videos = data['Videos'];
          for (var i = 0; i < videos.length; i++) {
            if (row.childElementCount == 2) {
                row = document.createElement('div');
                row.className = 'row';
                row.style="height:284";
                overallDiv.appendChild(row);
            }
            var videoDiv = document.createElement('div');
            videoDiv.className = 'col-md-6';
            row.appendChild(videoDiv);

            var innerDiv = document.createElement('div');
            videoDiv.appendChild(innerDiv);

            var img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = videos[i]['PreviewImage'];
            img.style = "width: 300px; height: 240px; border-radius:6px; border: 1px solid #67809f";
            innerDiv.appendChild(img);

            var heading = document.createElement('p');
            heading.className = 'textUnderVid';
            heading.innerHTML = "Lecture on " + videos[i]['Date'];
            videoDiv.appendChild(heading);
          }

        }.bind(this));
    }

    keywordLoadFromCrud (searchTerm, courseId, masterDiv) { 
      callAPI(login_origins.backend + "/getKeywordSuggestions", "GET", {'count': 50, 'minKeywordLength': 3, 'CourseId': courseId}, function(results) {
        results.sort( function() { return 0.5 - Math.random() } );
        this.keywordGeneration(searchTerm, courseId, masterDiv, results);
      }.bind(this));
    }

    keywordGeneration (searchTerm, courseId, masterDiv, results) {
      var recKeywords = $(".recClass")[0];
      masterDiv.appendChild(recKeywords);
      for (var i = 0; i < 6; i++){
        var recs = document.createElement('button');
        recs.innerHTML = results[i];
        recKeywords.appendChild(recs);
        var currentColor = this.fnGetRandomColour(120, 250);
        $(recs).css({"border":"2pxsolid " + currentColor, "background-color" : currentColor});
        $(recs).on("click", function (ev) {
          window.location.hash =  "#/search/" + courseId + "/" + $(ev.target).html();
        });
      }
    }

    fnGetRandomColour(iDarkLuma, iLightLuma)  {       
      for (var i=0;i<20;i++)
      {
        var sColour = ('ffffff' + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);

        var rgb = parseInt(sColour, 16);   // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff;  // extract red
        var g = (rgb >>  8) & 0xff;  // extract green
        var b = (rgb >>  0) & 0xff;  // extract blue

        var iLuma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709


        if (iLuma > iDarkLuma && iLuma < iLightLuma) return sColour;
      }
      return sColour;
    } 
}
