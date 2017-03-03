/*
<div class="col-10 post-container post-container-ocr offset-1">
<div class="row post-header">
        <span class="col-12 type-of-ocr"></span>
</div>
</div>*/

class SearchCardClass {
    constructor (courseId, mainDiv, searchTerm) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;

        var masterDiv = $(this.mainDiv).find('#search-videos-div')[0];
        $(this.mainDiv).find("#title").html("Here are some videos we found about \"" + searchTerm + "\"");

        this.keywordLoadFromCrud(searchTerm, courseId, masterDiv);
        callAPI(login_origins.backend + "/searchByKeywords", "GET", {"count": 6, "CourseId": this.courseId, "Keywords": searchTerm}, function(data) {
          var overallDiv = $(this.mainDiv).find(".videos-div")[0];
          masterDiv.appendChild(overallDiv);
          overallDiv.class = 'scroll';
          
        
          /* Row to hold cards */
          var row = document.createElement('div');
          row.className = 'row videos-row';
          overallDiv.appendChild(row);

          var videos = data;
 
          for (var i = 0; i < videos.length; i++) {
            var curr = videos[i];
              
            /*if (row.childElementCount == 3) {
                row = document.createElement('div');
                row.className = 'row videos-row';
                overallDiv.appendChild(row);
            }*/
              
            /* Card to hold video, header:title and keywords */
            var card = document.createElement('div');
            card.className = 'video-card col-4';

            var header = document.createElement('div');
            header.className = 'row post-header';
              
            var title = document.createElement('span');
            title.className = 'col-12 type-of-ocr';
            title.innerHTML = moment(videos[i]['Time']).format("ddd, MMM Do");
            header.appendChild(title);
            var hr = document.createElement('hr');  
            hr.className = 'ocr-module-hr';
              
              
            var videoDiv = document.createElement('div');
            videoDiv.className = 'col-4';
            var img = document.createElement('img');
            img.className = 'search-videos-img';
            img.src = videos[i]['PodcastImage'];
            $(img).attr("data-podcastid", curr['PodcastId']);
            $(img).on("click", function (ev) {
              window.location.hash = '#/podcast/' + $(ev.target).attr("data-podcastid");
            });
            videoDiv.appendChild(img);
            card.appendChild(header);
            card.appendChild(videoDiv);
            card.appendChild(hr);
            this.appendOCRandAudio(card, courseId);
            
            row.appendChild(card)
            overallDiv.appendChild(row);
          }

        }.bind(this));
    }
    
    appendOCRandAudio(cardDiv, courseId) {
        
        /** INCORRECT CALL PLACEHOLDER*/
        /** APPEND MATCHING AUDIO/OCR INFO HERE */
        callAPI(login_origins.backend + "/getKeywordSuggestions", "GET", {'count': 50, 'minKeywordLength': 3, 'CourseId': courseId}, function(results) {
        results.sort( function() { return 0.5 - Math.random() } );
            for (var i = 0; i < 8; i ++) {
                var key = document.createElement('span');
                key.className = 'col-12 type-of-ocr';
                key.innerHTML = results[i];
                var hr = document.createElement('hr');  
                hr.className = 'ocr-module-hr';
                cardDiv.appendChild(key);
                cardDiv.appendChild(hr);
                
            }
        }.bind(this));
        
    }
    /*
    generateCardforVideo(thisClass) {
        loadHTMLComponent("SearchCardModule", function(data) {
            var myDomData = $(data);
            $(myDomData).find(".video-label").html("Audio Transcription Search");
            var toInsertPos = $(thisClass.mainDiv).find(".no-results");
            $(myDomData).insertAfter(toInsertPos);
            thisClass.audioPost = myDomData;
            thisClass.generateIndividualPostsForAudio(myDomData, thisClass);
            thisClass.hideTable(myDomData);
            callback();
        });
    }*/

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
