class SearchCardClass {
    constructor (courseId, mainDiv, searchTerm, data) {
        this.courseId = courseId;
        
        this.mainDiv = $(mainDiv);
        this.card = document.getElementById("video-card");//$(this.mainDiv).find(".video-card");
        this.title = document.getElementById("video-card-title");//$(this.mainDiv).find(".video-card-title");
        this.img = document.getElementById("video-card-img");//$(this.mainDiv).find(".video-card-img");
        
        $(this.title).html(moment(data['Time']).format("ddd, MMM Do"));
        
        $(this.img).attr('src', data['PodcastImage']);
        $(this.img).attr("data-podcastid", data['PodcastId']);
        
        $(this.card).on("click", function (ev) {
            window.location.hash = '#/podcast/' + $(ev.target).attr("data-podcastid");
        });
        //this.appendOCRandAudio(this.card, data);
        
        this.appendOCRandAudio(this.card, data);
        console.log(this.card);
    }
    
    appendOCRandAudio(cardDiv, data) {    
        for (var i = 0; i < 8; i ++) {
            var key = document.createElement('span');
            key.className = 'col-12 type-of-ocr';
            key.innerHTML = data['OCRKeywords'][i];
            var hr = document.createElement('hr');  
            hr.className = 'ocr-module-hr';
            $(cardDiv).append(key);
            $(cardDiv).append(hr);
        }
    }   
}
