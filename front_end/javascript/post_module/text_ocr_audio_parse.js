var OCRAudioIndPost = class OCRAudioIndPost {

    // startTime (in SECONDS) is optional and only applicable for the sub-modules
    constructor (content, slideNum, divToAppend, startTime) {
        this.divToAppend = divToAppend;
        this.content = content.replace(/[\s\r\n]+$/, '');;
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
        setTimeout(function () {
            thisClass.ensureDataLoad(function () {
                $(thisClass.entireData).show();
            }); 
        }, 0);
    }

    hideThisPost (thisClass) {
      setTimeout(function () {
            thisClass.ensureDataLoad(function () {
                $(thisClass.entireData).hide();
            }); 
        }, 0);
    }

    checkForContent (searchTerm) {
        var isContent = this.content.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
        if (isContent) { 
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