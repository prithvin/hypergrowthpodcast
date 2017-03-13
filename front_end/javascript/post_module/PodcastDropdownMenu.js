var PodcastDropdownMenu = class PodcastDropdownMenu {
    
    // Dropdown shows all the slides
    // Unanswered questions (questions with no comments)
    // Notes
    // All slides (deafult search?)
    // Search made (connect this method with the podcast page)
    // By default SHOWS ALL POSTS IN LECTURE

    constructor(numSlides, divOfDropdown, slideTimes, videoURL) {
        this.mainDiv = divOfDropdown;
        this.slideTimes = slideTimes;
        this.videoURL = videoURL; // TODO 
        this.numSlides = numSlides;
        this.slideImages = [];
        this.dropdownMenuOptions = $(this.mainDiv).find(".dropdown-menu");
        this.slideDropdownItems = {};
        this.generateNonSlideOptions();
        this.generateDropdownForSlides();
        this.updateSlideTextListener();

        // Default value
        $(this.mainDiv).find("#dropdownSlideSelection").children("span").html("Entire Lecture");
    }

    videoSeekerThumb () { 
        var index = 0;
        var video = document.createElement("video");

        video.addEventListener('loadeddata', function() {
            if (this.slideTimes.length > 0) 
                video.currentTime = this.slideTimes[0];
        }, false);

        video.addEventListener('seeked', function() {
            this.slideImages.push(this.generateThumbnail(video));
            index++;
            if (index < this.slideTimes.length)
                video.currentTime = this.slideTimes[index];
        }.bind(this), false);

        video.preload = "auto";
        video.src = this.videoURL;
    }

    generateThumbnail(video) {
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        c.width = 320;
        c.height = 180;
        ctx.drawImage(video, 0, 0, 320, 180);
        return c;
    }

    generateNonSlideOptions () {
        var nonSlideOptions = ["Entire Lecture", "Unresolved Posts", "My Notes"];
        for (var x = 0; x < nonSlideOptions.length; x++) {
            var nextOpt = this.generateDropdownWithType(nonSlideOptions[x]);
            this.slideDropdownItems[nextOpt[x]] = nextOpt;
            this.dropdownMenuOptions.append(nextOpt);
        }
    }

    generateDropdownForSlides () {

        // Slides are one-indexed
        for (var x = 1; x <= this.numSlides; x++) {
            var nextSlide = this.generateOneDropdownForSlide(x);
            this.slideDropdownItems[x] = nextSlide;
            this.dropdownMenuOptions.append(nextSlide);
        }
    }

    updateSlideTextListener () {
        $(this.mainDiv).find(".dropdown-item").on("click", function (ev) {
            if ($(ev.target).html() == "Entire Lecture") {
                $(this.mainDiv).trigger("AllLecture", []);
            }
            if ($(ev.target).html() == "Unresolved Posts") {
                $(this.mainDiv).trigger("UnresolvedLecture", []);
            }
            if ($(ev.target).html() == "My Notes") {
                $(this.mainDiv).trigger("ShowNotes", []);
            }
            $(this.mainDiv).find("#dropdownSlideSelection").children("span").html($(ev.target).html());
        }.bind(this))
    }

    initializeSearch (text) {
        $(this.mainDiv).find("#dropdownSlideSelection").children("span").html("Search Results for \"" + text + "\" ");
    }
    switchToSlide (slideNo) {
        $(this.mainDiv).find("#dropdownSlideSelection").children("span").html($(this.slideDropdownItems[slideNo]).html());
    }

    switchToAllLecture() {
        $(this.mainDiv).find("#dropdownSlideSelection").children("span").html("Entire Lecture");
    }

    generateDropdownWithType (type) {
        return $("<a>").addClass("dropdown-item").attr("data-type", type).html(type);
    }

    generateOneDropdownForSlide (slideNo) {
        return $("<a>").addClass("dropdown-item").addClass("slide-no").attr("data-slide", slideNo).html("Slide " + slideNo + " Feed");
    }


}

