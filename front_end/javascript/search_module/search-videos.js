class SearchVideosClass {
    constructor (courseId, mainDiv) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
      
        callAPI("fake_data/searchResults.json", "GET", {}, function(data) {
          console.log(data);
          var masterDiv = document.getElementById('search-videos-div');

          var row = document.createElement('div');
          row.className = 'row';
          masterDiv.appendChild(row);

          var videos = data;
          for (var i = 0; i < videos.length; i++) {
              if (row.childElementCount == 2) {
                  row = document.createElement('div');
                  row.className = 'row';
                  masterDiv.appendChild(row);
              }
              var videoDiv = document.createElement('div');
              videoDiv.className = 'col-md-6';
              row.appendChild(videoDiv);

              var img = document.createElement('img');
              img.className = 'img-fluid';
              img.src = videos[i]['PreviewImage'];
              videoDiv.appendChild(img);

              var heading = document.createElement('h5');
              heading.align = 'center';
              heading.innerHTML = videos[i]['Date'];
              videoDiv.appendChild(heading);
              
              var keyword = document.createElement('h5');
              keyword.align = 'center';
              var allKeywords = videos[i]['Keywords'];
              keyword.innerHTML = "Keywords: ";
              for (int j = 0; j < allKeywords.length - 1; j++) {
                  keyword.innerHTML += allKeywords[i] + ", ";
              }
              keyword.innerHTML += allKeywords[allKeywords.length - 1];
              videoDiv.appendChild(keyword);
              
              var ocrMatch = document.createElement('h5');
              ocrMatch.align = 'center';
              ocrMatch.innerHTML = "OCR match on " + videos[i]['OCRMatch']['Quote'] + " on Slide " + videos[i]['OCRMatch']['Slide'];
              videoDiv.appendChild(ocrMatch);
              
          }
        });
    }
}