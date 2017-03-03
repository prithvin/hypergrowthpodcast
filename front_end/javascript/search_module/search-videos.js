class SearchVideosClass {
    constructor (courseId, mainDiv, searchTerm) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
        this.searchTerm = searchTerm;

        this.masterDiv = $(this.mainDiv).find('#search-videos-div')[0];
        $(this.mainDiv).find("#title").html("Here are some videos we found about \"" + searchTerm + "\"");
        this.overallDiv = $(this.mainDiv).find(".videos-div")[0];
        
        this.keywordLoadFromCrud(searchTerm, courseId, this.masterDiv);
        callAPI(login_origins.backend + "/searchByKeywords", "GET", {"count": 6, "CourseId": this.courseId, "Keywords": searchTerm}, function(data) {
          
          this.masterDiv.appendChild(this.overallDiv);
          this.overallDiv.class = 'scroll';

          var row = document.createElement('div');
          row.className = 'row videos-row';
          row.id = 'single-row';
          this.overallDiv.appendChild(row);

          var videos = data;
        
          for (var i = 0; i < videos.length; i++) {
            var curr = videos[i];
            this.loadCard(curr, row);

            /*
            if (row.childElementCount == 3) {
                row = document.createElement('div');
                row.className = 'row videos-row';
                this.overallDiv.appendChild(row);
            }
            var videoDiv = document.createElement('div');
            videoDiv.className = 'col-4';
            row.appendChild(videoDiv);

            var img = document.createElement('img');
            img.className = 'search-videos-img';
            img.src = videos[i]['PodcastImage'];
            $(img).attr("data-podcastid", curr['PodcastId']);
            $(img).on("click", function (ev) {
              window.location.hash = '#/podcast/' + $(ev.target).attr("data-podcastid");
            });
            videoDiv.appendChild(img);

            var heading = document.createElement('p');
            heading.className = 'textUnderVid';
            heading.innerHTML = moment(videos[i]['Time']).format("ddd, MMM Do");
            videoDiv.appendChild(heading);*/
          }

        }.bind(this));
    }
    
    loadCardData (callback) {
        loadHTMLComponent("SearchCardModule", function (data) {
            callback(data);
        });
    }
    
   loadCard(curr_video_data, divToAppend) {
       this.loadCardData(function (cardTemplate) {
            var newDiv = $(cardTemplate);
            var newCardObj = new SearchCardClass(this.courseId, newDiv, this.searchTerm, curr_video_data);
            $(divToAppend).prepend(newDiv);
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
      var colors = ['009788', '00bcd6', '323e94', '6734ba', '9d1cb2', 'c81352'];
      for (var i = 0; i < 6; i++){
        var recs = document.createElement('button');
        recs.innerHTML = results[i];
        recKeywords.appendChild(recs);
        var currentColor = colors[i];
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
