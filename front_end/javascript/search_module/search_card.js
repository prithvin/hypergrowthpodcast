/*
<div class="col-10 post-container post-container-ocr offset-1">
<div class="row post-header">
        <span class="col-12 type-of-ocr"></span>
</div>
</div>*/

class SearchCardClass {
    constructor (courseId, mainDiv, searchTerm, data) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;

        var masterDiv = $(this.mainDiv).find('#single-row')[0];
        var overallDiv = $(this.mainDiv).find("#video-card")[0];
        masterDiv.appendChild(overallDiv);
    
        document.getElementById('video-card-title').innerHTML = moment(data['Time']).format("ddd, MMM Do");
 
        var hr = document.createElement('hr');  
        hr.className = 'ocr-module-hr';
              
        var img = document.getElementById('video-card-img');
        img.setAttribute('src', data['PodcastImage']);
        img.setAttribute("data-podcastid", data['PodcastId']);
        $("#video-card").on("click", function (ev) {
            window.location.hash = '#/podcast/' + $(ev.target).attr("data-podcastid");
        });
        console.log(data);
        this.appendOCRandAudio(overallDiv, data);
    }
    
    appendOCRandAudio(cardDiv, data) {    
            for (var i = 0; i < 8; i ++) {
                var key = document.createElement('span');
                key.className = 'col-12 type-of-ocr';
                key.innerHTML = data['OCRKeywords'][i];
                var hr = document.createElement('hr');  
                hr.className = 'ocr-module-hr';
                cardDiv.appendChild(key);
                cardDiv.appendChild(hr);
            }
    }
}
