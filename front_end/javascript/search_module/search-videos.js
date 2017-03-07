var SearchVideosClass =  class SearchVideosClass {
    constructor (courseId, mainDiv, searchTerm) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
        this.searchTerm = searchTerm;

        this.masterDiv = $(this.mainDiv).find('#search-videos-div')[0];
        $(this.mainDiv).find("#title").html("Here are some videos we found about \"" + searchTerm + "\"");
        this.overallDiv = $(this.mainDiv).find(".videos-div")[0];
        
        this.keywordLoadFromCrud(searchTerm, courseId, this.masterDiv);
        this.loadCourseCards(searchTerm);

    }

    loadCourseCards (searchTerm) {
      callAPI(login_origins.backend + "/deepSearchByKeywords", "GET", {"CourseId": this.courseId, "Keywords": searchTerm}, function (resultData) {
        this.loadCard(resultData)
        var waterfall = new Waterfall({
          containerSelector: '#search-vid',
          boxSelector: '.video-card',
          minBoxWidth: 250
        });
      }.bind(this));
    }

    loadCard (resultData) {
      loadHTMLComponent("SearchCardModule", function (data) {
        for (var x = 0; x < resultData.length; x++) {
          var mainDiv = $(data);
          new SearchCardClass($(mainDiv), this.searchTerm, resultData[x]);
            
          $(this.mainDiv).find("#search-vid").append(mainDiv);
        }
      }.bind(this));
      
    }

    keywordLoadFromCrud (searchTerm, courseId, masterDiv) { 
      callAPI(login_origins.backend + "/getKeywordSuggestions", "GET", {'count': 50, 'minKeywordLength': 3, 'CourseId': courseId}, function(results) {
        var topSixResults = []; // random, using hash
        var hashTerm = Math.abs(this.hash(searchTerm)) % results.length;
        var firstHashed = hashTerm;
        for (var x = 0; x < 6; x++) {
          topSixResults.push(results[firstHashed]);
          firstHashed += hashTerm;
          firstHashed = firstHashed % results.length;
        }
        this.keywordGeneration(searchTerm, courseId, masterDiv, topSixResults);
      }.bind(this));
    }

    hash(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    }

    keywordGeneration (searchTerm, courseId, masterDiv, results) {
      var recKeywords = $(".recClass")[0];
      var colors = ['009788', '00bcd6', '323e94', '6734ba', '9d1cb2', 'c81352'];
      for (var i = 0; i < 6; i++){
        var recs = document.createElement('button');
          
        var link_anchor = document.createElement('a');
        
        
          
        recs.innerHTML = results[i];
        link_anchor.href = "#/search/" + courseId + "/" + results[i];
        link_anchor.style = 'text-decoration: none; color: inherit';
        link_anchor.class = "recClass";
        link_anchor.appendChild(recs);

          //recs.appendChild(link_anchor);
        recKeywords.appendChild(link_anchor);
        //recKeywords.appendChild(recs);

        var currentColor = colors[i];
        $(recs).css({"border":"2pxsolid " + currentColor, "background-color" : currentColor, "font-family": "Open Sans, sans-serif"});
        /*$(recs).on("click", function (ev) {
          window.location.hash =  "#/search/" + courseId + "/" + $(ev.target).html();
        });*/
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
