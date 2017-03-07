var SearchCardClass = class SearchCardClass {

    /*
        Data: {LectureTime, Matches: {SlideNo, Text, Type, Time (if applicable)}   PodcastId, PodcastImage}
    */
    constructor (mainDiv, searchTerm, data) {
        
        this.mainDiv = $(mainDiv);
        this.data = data;
        this.mark = new Mark($(this.mainDiv)[0]);
        this.searchTerm = searchTerm;
        
        // Update DOM stuff
        $(this.mainDiv).find(".lecture-image-search").attr("src", data['PodcastImage']);
        this.title = $(mainDiv).find(".video-card-title");

        // Listeners and stuff
        $(this.title).html(moment(data['LectureTime']).format("dddd, MM/DD"));
        this.clickedImage();
        this.slideClicks();

        
        loadHTMLComponent("SearchCardIndvModule", function (htmlComponent) {
            this.cardModule = htmlComponent;
            this.appendOCRandAudio(this.mainDiv, data);
        }.bind(this));

        this.mark.mark(searchTerm, { 
            "caseSensitive" : false, 
            "separateWordSearch" : false,
            "exclude": [".pre-slide-data", ".slide-no"]
        });
        
    }

    clickedImage () {
        $(this.mainDiv).find(".title-video-data").attr('href', '#/podcast/' + this.data['PodcastId']);
        $(this.mainDiv).find(".title-video-data").attr('style', 'text-decoration: none');
        /*$(this.mainDiv).find(".title-video-data").on("click", function (ev) {
            window.location.hash = '#/podcast/' + this.data['PodcastId'];
        }.bind(this));*/
    }

    slideClicks () {
        /*$(this.mainDiv).on("click", ".slide-no", function (ev) {
            window.location.hash = '#/podcast/' + this.data['PodcastId'] + "/" + $(ev.target).attr("data-slide");
        }.bind(this));*/
    }
    
    appendOCRandAudio(cardDiv, data) {    
        var matches = data.Matches;
        var arr = [];
        for (var i = 0; i < matches.length; i ++) {
            var ocrText = $(this.cardModule);
            arr.push(ocrText);
            ocrText.find(".content-span").html(this.generateMatch(matches[i].Text));
            if (matches[i].Type == "AUDIO")
                ocrText.find(".pre-slide-data").html("Audio match on");
            else
                ocrText.find(".pre-slide-data").html("Slide match on");
            ocrText.find(".slide-no").attr("data-slide", matches[i].SlideNo).html("Slide " + matches[i].SlideNo);
            //console.log(data);
            var link_anchor = ocrText.find(".linker");
                link_anchor.attr('href', '#/podcast/' + data['PodcastId'] + '/' + matches[i].SlideNo);
                link_anchor.attr('style', 'text-decoration: none; color: inherit');
            
            
            //link_anchor.append(ocrText);

            $(cardDiv).append(ocrText);
            //$(cardDiv).append(link_anchor);

            if (i != 0)
                $(ocrText).hide();
        }

        if (arr.length > 1) {
            loadHTMLComponent("SeeMoreTinySearchCardModule", function (data) {
                var seeMoreButton = $(data);
                $(cardDiv).append(seeMoreButton);
                this.seeMoreButton = seeMoreButton;
                this.arrOfThings = arr;
                this.seeMoreListener();
            }.bind(this));
        }
    }   


    seeMoreListener () {

        $(this.seeMoreButton).on("click", function () {
            $(this.seeMoreButton).hide();
            this.seeMoreRecursive(0);
        }.bind(this));
    }

    seeMoreRecursive (index) {
        if (index == this.arrOfThings.length) 
            return;
        $(this.arrOfThings[index]).slideDown(100);
        this.seeMoreRecursive(index + 1);
    }

    generateMatch(text) {
        var searchTerm = this.searchTerm;
        var pattern = new RegExp(searchTerm, 'gi');

        var splittedString = text.split(pattern);
        var newString = "";
        for (var x = 1; x < splittedString.length; x++) 
            newString += this.getFiveDiffs(splittedString[x - 1], searchTerm, splittedString[x]);
        return newString;
    }

    getFiveDiffs (left, term, right) {
        var newLeft = left.split(' ').slice(0, 5).join(' ');
        var term = " " + term + " ";

        var splitRight = right.split(' ');
        var newRight = splitRight.slice(splitRight.length - 5).join(' ');

        return "..." + newLeft + term  + newRight + "...\n";
        
    }

}
