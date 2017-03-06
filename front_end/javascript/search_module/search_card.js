class SearchCardClass {
    constructor (courseId, mainDiv, searchTerm, data) {
        this.courseId = courseId;
        
        this.card = $(mainDiv);
        this.title = $(mainDiv).find(".video-card-title");
        
        $(this.title).html(moment(data['Time']).format("dddd, MM/DD"));

        $(this.card).attr("data-podcastid", data['PodcastId']);
        
        $(this.card).on("click", function (ev) {
            window.location.hash = '#/podcast/' + this.getAttribute("data-podcastid");
        });

        loadHTMLComponent("SearchCardIndvModule", function (htmlComponent) {
            this.cardModule = htmlComponent;
            this.appendOCRandAudio(this.card, data);
        }.bind(this));
        
        
    }
    
    appendOCRandAudio(cardDiv, data) {    
        console.log(data);
        for (var i = 0; i < Math.random() * 8; i ++) {
            var ocrText = $(this.cardModule);
            ocrText.find(".content-span").html("This is a post " + i);
            console.log(ocrText);
            $(cardDiv).append(ocrText);
        }
    }   
}
