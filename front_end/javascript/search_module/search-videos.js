class SearchVideosClass {
    constructor (courseId, mainDiv) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;

        callAPI("fake_data/searchResults.json", "GET", {}, function(data) {
          console.log(data);
          var masterDiv = document.getElementById('search-videos-div');
          document.getElementById('title').innerHTML = "Search Results for " + data['Query'] + "  in " + data['Title'];

          var recKeywords = document.createElement('div');
          recKeywords.class='recClass';
          recKeywords.style='margin-top:-20px;margin-bottom:15;overflow:hidden; height: 40; width:100%; display:flex; justify-content:space-between;text-align: center';
          masterDiv.appendChild(recKeywords);
          for (var i = 0; i < 6; i++){
            var recs = document.createElement('button');
            recs.innerHTML = `keyrec #${i}`;
            recs.style="font-size:14;height:80%; width: 80%; border-radius:8px; margin-left: 8; margin-top:8;display: inline-block;text-align:center;border:2px solid #124d87; background-color:#124d87; color:white";
            recKeywords.appendChild(recs);

            recs.onclick = function(){
              //run new search with selected keyword;
            }
          }

          var overallDiv = document.createElement('div');
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

              // var imageTextDiv = document.createElement('div');
              // imageTextDiv.className = 'imageOverVid';
              // innerDiv.appendChild(imageTextDiv);
              //
              // var keyword = document.createElement('p');
              // keyword.style = "bottom: 10; left: 50; position:absolute";
              // var allKeywords = videos[i]['Keywords'];
              // keyword.innerHTML = "Keywords: ";
              // for (var j = 0; j < allKeywords.length - 1; j++) {
              //     keyword.innerHTML += allKeywords[j] + ", ";
              // }
              // keyword.innerHTML += allKeywords[allKeywords.length - 1];
              // imageTextDiv.appendChild(keyword);
              //
              // var ocrMatch = document.createElement('p');
              // ocrMatch.style = "bottom: -13; left: 50; position:absolute";
              // ocrMatch.innerHTML = "OCR match on " + videos[i]['OCRMatch']['Quote'] + " on Slide " + videos[i]['OCRMatch']['Slide'];
              // imageTextDiv.appendChild(ocrMatch);

              var heading = document.createElement('p');
              heading.className = 'textUnderVid';
              heading.innerHTML = "Lecture on " + videos[i]['Date'];
              videoDiv.appendChild(heading);
          }

        });
    }
}
