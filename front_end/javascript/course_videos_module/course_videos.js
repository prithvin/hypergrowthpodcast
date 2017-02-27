class CourseVideosClass {
  
    constructor (courseId, mainDiv, loadingCallback) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
        this.loadingCallback = loadingCallback;
        
        callAPI(login_origins.backend + '/getVideosForCourse', 'GET', {'CourseId': courseId}, function(data) {
          var masterDiv = document.getElementById('course-videos-div');
          //document.getElementById('course-title').innerHTML = data['CourseTitle'];
          var row = document.createElement('div');
          row.className = 'row videos-row';
          masterDiv.appendChild(row);

          var videos = data['Videos'];
          for (var i = 0; i < videos.length; i++) {
              var curr = videos[i];
            
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
              img.src = curr['PreviewImage'];
              img.addEventListener('click', function() {
                window.location.hash = '#/podcast/' + this['Id']; 
              }.bind(curr));
              videoDiv.appendChild(img);

              var heading = document.createElement('p');
              heading.align = 'center';
              //var date = new Date(curr['Time']);
              heading.innerHTML = moment(curr['Time']).format("ddd, M/D"); //date.toLocaleDateString();
              heading.className = 'text-title';
              videoDiv.appendChild(heading);
          }
          this.loadingCallback();
        }.bind(this));
    }
}
