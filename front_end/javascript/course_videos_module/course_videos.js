class CourseVideosClass {
    constructor (courseId, mainDiv) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
      
        callAPI("fake_data/courseVideos.json", "GET", {}, function(data) {
          console.log(data);
          var masterDiv = document.getElementById('course-videos-div');
//          console.log(masterDiv);
          document.getElementById('course-title').innerHTML = data['CourseTitle'];
          var row = document.createElement('div');
          row.className = 'row videos-row';
          masterDiv.appendChild(row);

          var videos = data['Videos'];
          for (var i = 0; i < videos.length; i++) {
              if (row.childElementCount == 3) {
                  row = document.createElement('div');
                  row.className = 'row videos-row';
                  masterDiv.appendChild(row);
              }
              var videoDiv = document.createElement('div');
              videoDiv.className = 'col-4';
              row.appendChild(videoDiv);

              var img = document.createElement('img');
              img.className = 'course-videos-preview-images';
              img.src = videos[i]['PreviewImage'];
              videoDiv.appendChild(img);

              var heading = document.createElement('p');
              heading.align = 'center';
              heading.innerHTML = videos[i]['Date'];
              videoDiv.appendChild(heading);
          }
        });
    }
}