/*
    ocrAudioData 
        -Only open for Prithvi/ Allen to use, no docs needed
    {
        "ParsedAudioTranscriptForSearch":
        "Slides":
    }
*/
var OCRAudioPosts = class OCRAudioPosts {
    constructor (ocrAudioData, mainDiv, loadedCallback) {
        this.audioPosts = [];
        this.ocrPosts = [];

        this.ocrAudioData = ocrAudioData;
        this.mainDiv = mainDiv;
        this.parseSlides();
        this.generatePosts(this, function () {
            loadedCallback();
        });

       

        //new OCRAudioIndPost();
    }

    doSearchInAudio (query) {
        if (query.trim().length == 0) {
            this.hideTable(this.audioPost);
            return true;
        }

        var foundAnything = false;
        for (var x = 0; x < this.audioPosts.length; x++) {
            var nextQuery = this.audioPosts[x].checkForContent(query);
            foundAnything = foundAnything || nextQuery;
        }
        if (!foundAnything)  {
            this.hideTable(this.audioPost);
            return false;
        }
        else  {
            this.showTable(this.audioPost);
            return true;
        }
    }

    doSearchInOCR (query) {
        if (query.trim().length == 0) {
            this.hideTable(this.ocrPost);
            return true;
        }

        var foundAnything = false;
        for (var x = 0; x < this.ocrPosts.length; x++) {
            var nextQuery = this.ocrPosts[x].checkForContent(query);
            foundAnything = foundAnything || nextQuery;
        }
        if (!foundAnything) {
            this.hideTable(this.ocrPost);
            return false;
        }
        else  {
            this.showTable(this.ocrPost);
            return true;
        }
    }

    doSlideCheckInAudio (slideNum) {


    }

    doSlideCheckInOCR (slideNum) {

    }

    showTable (element) {
        $(element).show();
    }

    hideTable (element) {
        $(element).hide();
    }

    generatePosts (thisClass, callback) {
        thisClass.generatePostForAudio(thisClass, function () {
            thisClass.generatePostForOCR(thisClass, function () {
                callback();
            });
        });
    }

    generatePostForAudio (thisClass, callback) {
        loadHTMLComponent("AudioOCRMod", function(data) {
            var myDomData = $(data);
            $(myDomData).find(".type-of-ocr").html("Audio Transcription Search");
            var toInsertPos = $(thisClass.mainDiv).find(".no-results");
            $(myDomData).insertAfter(toInsertPos);
            thisClass.audioPost = myDomData;
            thisClass.generateIndividualPostsForAudio(myDomData, thisClass);
            thisClass.hideTable(myDomData);
            callback();
        });
    }

    generateIndividualPostsForAudio (mainDom, thisClass) {
        var audioData = thisClass.ocrAudioData["ParsedAudioTranscriptForSearch"];
        for (var x = 0; x < audioData.length; x++) {
            thisClass.audioPosts.push(new OCRAudioIndPost(
                audioData[x]["Content"],
                thisClass.getSlideForTime(audioData[x]["StartTime"]),
                mainDom,
                audioData[x]["StartTime"]
            ));
        }
    }

    generatePostForOCR (thisClass, callback) {
        loadHTMLComponent("AudioOCRMod", function(data) {
            var myDomData = $(data);
            $(myDomData).find(".type-of-ocr").html("Slide Search");
            var toInsertPos = $(thisClass.mainDiv).find(".no-results");
            $(myDomData).insertAfter(toInsertPos);
            thisClass.ocrPost = myDomData;
            thisClass.generateIndividualPostsForOCR(myDomData, thisClass);
            thisClass.hideTable(myDomData);
            callback();
        });
    }

    generateIndividualPostsForOCR (mainDom, thisClass) {
        var slideData = thisClass.ocrAudioData["Slides"];
        for (var x = 0; x < slideData.length; x++) {
            thisClass.ocrPosts.push(new OCRAudioIndPost(
                slideData[x]["OCRTranscription"],
                slideData[x]["SlideNum"],
                mainDom,
                null
            ));
        }
    }

    parseSlides () {
        var slides = this.ocrAudioData['Slides'];

        // Note that the slides themselves are indexed starting at 1
        var slideTimes = [];
        for (var x = 0; x < slides.length; x++) {
            slideTimes.push(slides[x]["StartTime"]/1000);
        }
        this.slideTimes = slideTimes;
    }

    getTimeForSlide (slideNum) {
        if (slideNum <= 0) {
            console.error("Remember that slide numbers start at 1, not 0");
            return 0;
        }
        slideNum -= 1;
        if (slideNum >= this.slideTimes.length)
            return 0;
        else
            return this.slideTimes[slideNum];
    }

    getSlideForTime (timeValueInSeconds) {
        var targetSlide = this.getSlideForTimeHelper(this.slideTimes, function(x){
            return x-timeValueInSeconds;
        });
        return targetSlide + 1; // slides start at index 1!!
    }

    getSlideForTimeHelper (arr, compare) {
        var l = 0,
        r = arr.length - 1;
        while (l <= r) {
            var m = l + ((r - l) >> 1);
            var comp = compare(arr[m]);
            if (comp < 0) // arr[m] comes before the element
                l = m + 1;
            else if (comp > 0) // arr[m] comes after the element
                r = m - 1;
            else // arr[m] equals the element
                return m;
        }
        return l-1; // return the index of the next left item
                    // usually you would just return -1 in case nothing is found
    }
}