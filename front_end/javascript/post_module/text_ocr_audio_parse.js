var OCRAudioIndPost = class OCRAudioIndPost {

    // startTime (in SECONDS) is optional and only applicable for the sub-modules
    constructor (content, slideNum, divToAppend, startTime) {
        this.divToAppend = divToAppend;
        this.content = content;
        this.slideNum = slideNum;
        this.startTime = startTime;
        this.loadComponentAndAddData(this, function () {});
    }

    loadComponentAndAddData (thisClass, callback) {
        loadHTMLComponent("AudioOCRSubMod", function (data) {
            thisClass.entireData = $(data);
            $($(thisClass.entireData)[2]).find("span").html(thisClass.content);
            thisClass.determineSlideData($(thisClass.entireData).find(".pre-slide-data"),  $(thisClass.entireData).find(".slide-no"));
            $(thisClass.divToAppend).append(thisClass.entireData);
            thisClass.hideThisPost(thisClass);
            callback();
        });
    }

    ensureDataLoad (callback) {
        if (this.entireData != null) {
            callback();
        }
        else {
            this.loadComponentAndAddData(this, function () {
                callback();
            });
        }
    }

    showThisPost (thisClass) {
        this.ensureDataLoad(function () {
            var allData = $(thisClass.entireData);
            for (var x = 0; x < allData.length; x++)
                $(allData[x]).show();
             $(thisClass.entireData).show();
        }); 
    }

    hideThisPost (thisClass) {
        this.ensureDataLoad(function () {
            var allData = $(thisClass.entireData);
            for (var x = 0; x < allData.length; x++)
                $(allData[x]).hide();
            $(thisClass.entireData).hide();
        }); 
    }

    checkBySlideNo (slideNo) {
        if (slideNo == this.slideNum) {
            this.showThisPost(this);
            return true;
        }
        else {
            this.hideThisPost(this);
            return false;
        }
    }

    checkForContent (searchTerm) {
        var isContent = $("<div>" + this.content + "</div>").is(':contains("' + searchTerm + '")');
        var isSlide = $("<div>" + "Slide " + this.slideNum + "</div>").is(':contains("' + searchTerm + '")');
        var isTime = $("<div>" + this.getMinutesSecondsString() + "</div>").is(':contains("' + searchTerm + '")');
        if (isContent || isSlide || isTime) { 
            this.showThisPost(this);
            return true;
        }
        else {
            this.hideThisPost(this);
            return false;
        }
    }

    determineSlideData(preSlideEle, slideNoEle) {
        $(slideNoEle).attr("data-slide", this.slideNum).html("Slide " + this.slideNum);
        if (this.startTime) {
            $(preSlideEle).html("At " + this.getMinutesSecondsString());
            $(slideNoEle).attr("data-time", this.startTime);
        }
        else {
            $(preSlideEle).html("Found on ");
        }
    }

    getMinutesSecondsString() {
        if (this.startTime == null)
            return "";
        return parseInt(this.startTime/60) + " minutes and " + parseInt(this.startTime % 60) + " seconds on ";
    }
}