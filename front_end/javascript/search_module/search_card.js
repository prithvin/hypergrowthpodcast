class SearchCardClass {
    constructor (courseId, mainDiv, searchTerm, data) {
        this.courseId = courseId;
        
        this.card = $(mainDiv);
        this.title = $(mainDiv).find(".video-card-title");
        this.img = $(mainDiv).find(".video-card-img");
        
        $(this.title).html(moment(data['Time']).format("ddd, MMM Do"));
        
        $(this.img).attr('src', data['PodcastImage']);
        $(this.card).attr("data-podcastid", data['PodcastId']);
        
        $(this.card).on("click", function (ev) {
            window.location.hash = '#/podcast/' + this.getAttribute("data-podcastid");
        });
        
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
