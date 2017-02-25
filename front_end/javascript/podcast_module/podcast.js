var PodcastPage = class PodcastPage {

    constructor (podcastID, mainDiv, startingSlide) {
        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.startingSlide = startingSlide;
        if (!this.startingSlide)
            this.startingSlide = 1;
        this.fetchUserData(this);
        this.loadNavbar(this);
        this.loadRecommendations(mainDiv);
    }

    fetchUserData (thisClass) {
        callAPI("./fake_data/getUser.json", "GET", {}, function (data) {
            thisClass.UserName = data['Name'];
            thisClass.UserPic = data['Pic'];
            thisClass.fetchVideo(thisClass);
        });
    }

    parseSlides (slides) {
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


    getSlideClicks () {
        $(this.mainDiv).on("click", ".slide-no", function (ev) {
            var target = ev.currentTarget;
            var slideNo = $(ev.currentTarget).attr("data-slide");
            var slideTime = $(ev.currentTarget).attr("data-time");
            if (slideTime)
                this.videoClass.setTime(slideTime);
            else {
                this.videoClass.setTime(this.getTimeForSlide(slideNo));
            }
            this.postSearch.updateCurrentVideoSlide(slideNo);
            this.postSearch.changeSlideCompletely(slideNo);
        }.bind(this))
    }


    fetchVideo (thisClass) {
        callAPI("./fake_data/getVideo.json", "GET", {"PodcastID": this.podcastID}, 
            function (data) {
                thisClass.audioData = {
                    "ParsedAudioTranscriptForSearch": data['ParsedAudioTranscriptForSearch'],
                    "Slides": data['Slides']
                };
                thisClass.parseSlides(data['Slides']);
                thisClass.loadPosts(thisClass, function () {
                    thisClass.loadVideo(thisClass, data['VideoURL'], 0, data['SRTFile']);
                });
            }
        );
    }

    dynamicWindowResize (thisClass) {
        $(window).on("resize", function() {
            if ($(thisClass.mainDiv).length == 0) {
                $('#myimage').off('click.mynamespace');
            }
            else {
                thisClass.updatePostHeights();
            }
        });
        $(thisClass.mainDiv).bind("DOMSubtreeModified", function() {
            thisClass.updatePostHeights();
        });
    }

    loadNavbar (thisClass) {
        require(['navbar'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#navbox");
            loadComponent("MenuModule", divToLoad, function () {
                new NavBarLoggedInCourse(
                    divToLoad,
                    thisClass.podcastID
                );
            });
        });
    }

    loadPosts (thisClass, callback) {
        require(['postSearch'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#podcast-posts");
            loadComponent("PostSearchModule", divToLoad, function () {
                thisClass.postSearch = new PostSearch(
                    {
                        "UniqueID": thisClass.podcastID,
                        "TypeOfFetch": "PodcastSearch"
                    },
                    {
                        "Name": thisClass.UserName, 
                        "Pic": thisClass.UserPic
                    },
                    divToLoad,
                    thisClass.audioData,
                    {
                        "CurrentSlideNum": thisClass.startingSlide
                    },
                    function () {
                        setTimeout(function () {
                            thisClass.updatePostHeights() 
                        }, 500);
                        callback();
                    }.bind(thisClass)
                );
                thisClass.dynamicWindowResize(thisClass);
            });
        });
    }

    loadVideo (thisClass, url, startTime, srtFile){
        require(['video-wrapper'], function(){
            var divToLoad = $(thisClass.mainDiv).find("#video-space");

            loadComponent("VideoModule", divToLoad, function () {
                thisClass.videoClass = new videoClass(url, 0, divToLoad, srtFile, thisClass.slideTimes, function () {
                    thisClass.getSlideClicks();
                    thisClass.videoClass.setTime(thisClass.getTimeForSlide(thisClass.startingSlide));
                    thisClass.updateSlideNumberFromVideo();
                });
            });

        });                
    }

		loadRecommendations(mainDiv) {
      require(['recommendations'], function() {
        var rec_div = $(mainDiv).find('#recommendations-container')

        loadComponent('RecommendationsModule', rec_div, function() {
          new Recommendations(mainDiv);
        });
      });
    }

    nextPreVideoListeners () {
        //this.slideTimes
        //this.getSlideForTime
    }

    updateSlideNumberFromVideo () {
        $(this.mainDiv).find("#video-space").on("slideChange", function (ev, newSlide) {
            this.postSearch.updateCurrentVideoSlide(newSlide);
        }.bind(this));
    }

    updatePostHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#podcast-posts").css("height",newHeight );
    }
};
