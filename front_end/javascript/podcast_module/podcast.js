var PodcastPage = class PodcastPage {

    constructor (podcastID, mainDiv) {
        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.fetchUserData(this);
        this.loadNavbar(this);
        
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
         
        }.bind(this))
    }
    // The two methods below must be TODO
    fetchStartTimeBasedOnSlide () {

    }

    fetchStartingSlide () {

    }

    fetchVideo (thisClass) {
        callAPI("./fake_data/getVideo.json", "GET", {"PodcastID": this.podcastID}, 
            function (data) {
                thisClass.audioData = {
                    "ParsedAudioTranscriptForSearch": data['ParsedAudioTranscriptForSearch'],
                    "Slides": data['Slides']
                };
                thisClass.parseSlides(data['Slides']);
                thisClass.loadVideo(thisClass, data['VideoURL'], 0, data['SRTFile']);
                thisClass.loadPosts(thisClass);
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
        $(thisClass.mainDiv).find("#podcast-posts").bind("DOMSubtreeModified", function() {
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

    loadPosts (thisClass) {
        require(['postSearch'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#podcast-posts");
            loadComponent("PostSearchModule", divToLoad, function () {
                new PostSearch(
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
                    {},
                    function () {
                        setTimeout(function () {
                            thisClass.updatePostHeights() 
                        }, 500);
                    }.bind(thisClass)
                );
                thisClass.dynamicWindowResize(thisClass);
            });
        });
    }

    loadVideo (thisClass, url, startTime, srtFile){
        require(['video-wrapper'], function(){
            var divToLoad = $(thisClass.mainDiv).find("#video-space");

            loadComponent("VideoModule", divToLoad, function () 
                thisClass.videoClass = new videoClass(url, 0, divToLoad, srtFile);
                thisClass.getSlideClicks();
            });

        });                
    }
    updatePostHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#podcast-posts").css("height",newHeight );
    }
};