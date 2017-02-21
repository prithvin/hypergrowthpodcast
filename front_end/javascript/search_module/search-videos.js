class SearchVideosClass {
    constructor (courseId, mainDiv) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;

        callAPI("fake_data/searchResults.json", "GET", {}, function(data) {
          console.log(data);
          var masterDiv = document.getElementById('search-videos-div');
          document.getElementById('title').innerHTML = "Search Results for " + data['Query'] + "  in " + data['Title'];

          var overallDiv = document.createElement('div');
          overallDiv.style="overflow-y:scroll; overflow-x:hidden; height:70%";
          masterDiv.appendChild(overallDiv);
          overallDiv.class = 'scroll';

          var row = document.createElement('div');
          row.className = 'row';
          row.style="height:60%";
          overallDiv.appendChild(row);

          var videos = data['Videos'];
          for (var i = 0; i < videos.length; i++) {
              if (row.childElementCount == 2) {
                  row = document.createElement('div');
                  row.className = 'row';
                  row.style="height:60%";
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

              var imageTextDiv = document.createElement('div');
              imageTextDiv.className = 'imageOverVid';
              innerDiv.appendChild(imageTextDiv);

              var keyword = document.createElement('p');
              keyword.style = "bottom: 10; left: 50; position:absolute";
              var allKeywords = videos[i]['Keywords'];
              keyword.innerHTML = "Keywords: ";
              for (var j = 0; j < allKeywords.length - 1; j++) {
                  keyword.innerHTML += allKeywords[j] + ", ";
              }
              keyword.innerHTML += allKeywords[allKeywords.length - 1];
              imageTextDiv.appendChild(keyword);

              var ocrMatch = document.createElement('p');
              ocrMatch.style = "bottom: -13; left: 50; position:absolute";
              ocrMatch.innerHTML = "OCR match on " + videos[i]['OCRMatch']['Quote'] + " on Slide " + videos[i]['OCRMatch']['Slide'];
              imageTextDiv.appendChild(ocrMatch);

              var heading = document.createElement('p');
              heading.className = 'textUnderVid';
              heading.innerHTML = "Lecture on " + videos[i]['Date'];
              videoDiv.appendChild(heading);


          }
        });
    }
}
