
/*
    new PostSearch(
        {"UniqueID": "1", "TypeOfFetch": "PodcastSearch"},
        {"Name": "Prithvi Narasimhan", "Pic": "http://pages.stern.nyu.edu/~sbp345/websys/phonegap-facebook-plugin-master/src/android/facebook/FacebookLib/res/drawable/com_facebook_profile_picture_blank_square.png"},
        $(".search-module")
    )*/
var PostSearch = class PostSearch {

    /*
        Parameters:
            postFetchData (JSON Object, make sure all keys and values are valid)
                {
                    UniqueID: // unqiue id to query database with
                    TypeOfFetch: "CourseGlobal" (course home page --> unqiue id is courseid)
                                 "PodcastSearch" (podcast page --> unique id is podcastid)
                                 "CourseSearch" (course search --> unique id is course id)
                    SearchQuery: String // only required for CourseSearch
                }

            userData (JSON Object, make sure all keys and values are valid)
                {
                    Name: String,
                    Pic: String
                } // DB will be uploaded by user session token

            mainDiv (jquery object containing element where all elements on this page interact with)
    
            ocrAudioData --> again optional parameter
                -Only open for Prithvi/ Allen to use, no docs needed
            {
                "ParsedAudioTranscriptForSearch":
                "Slides":
            }


            <TODO> must implement still last paramtere stuff
            videoData (optional parameter if the video has already started playing)
                IF NOT USING, PLEASE PASS AS NULL, DONT PASS EMPTY JSON OBJECT PLZ
                {
                    CurrentSlideNum:
                }
    
             callback forwhen post page is loaded (only for post page)

    */
    constructor (postFetchData, userData, mainDiv, ocrAudioData, videoData, callback) {
        this.currWord = 0;
        this.postFetchData = postFetchData;
        this.userData = userData;
        this.mainDiv = $(mainDiv).find(".search-module");
        this.doneLoading = callback;

        // Default to current slide as one
        this.posts = [];

        this.currentSlide = 1;
        if (videoData)
            this.currentSlide = videoData['CurrentSlideNum'];
        this.setUpSlideTransitionModule();

        // DOM Elements
        this.searchModule = $(this.mainDiv).parent().find(".search-module");
        this.noResultsOption = $(this.mainDiv).find(".no-results");
        this.searchInputForm = $(this.mainDiv).prev();
        this.searchInputField = $(this.searchInputForm).find("#secondary-search-bar");
        this.viewAllPostsButton =  $(this.mainDiv).find(".all-posts-view");
        this.newPostButton = $(this.mainDiv).prev().find(".new-post-img");
        this.loadingModule = $(this.mainDiv).parent().find("#slide-transition-data");
        this.loadingModule.hide();
        // Package loads
        this.mark = new Mark($(this.searchModule)[0]);

        // DOM Interactions in constructor
        $(this.noResultsOption).hide();

        if (ocrAudioData) {
            this.ocrModule = new OCRAudioPosts(ocrAudioData, this.mainDiv, function () {
                this.OCRAudioLoaded = true;
            }.bind(this));
        }

        this.detectTypeOfPostsToShow(); // this.shouldAllowNewComments is set here
        this.loadPostsFromServer(this);
        this.noPostsNewPostHandling(this);
        this.startFormListeners(this);
        //this.initAutocomplete();
    }

    noPostsNewPostHandling (thisClass) {

        $(this.viewAllPostsButton).on("click", function (ev) {
            ev.preventDefault();
            thisClass.searchByText("");
        });

        $(this.newPostButton).on("click", function (ev) {
            var newPostVal = $(thisClass.searchInputField).val();
            if (newPostVal.trim().length == 0)
                swal("Please ask a question to search for!");   // Alert library
            else {
                thisClass.generateNewPost(newPostVal, new Date().getTime(), thisClass.currentSlide); // <TODO> FIX THIS WITH CURRENT SLIDE
            }
        });
    }

    startFormListeners (thisClass) {
        if (!this.OCRAudioLoaded) {
            setTimeout(function () {
                this.startFormListeners(this);
            }.bind(this), 500);
            return;
        }

        if (this.doneLoading) {
            this.doneLoading();
        }

        $(this.searchInputForm).on("submit", function (ev) {
            ev.preventDefault();
            if ($(this.searchInputField).val().length > 1) {
                this.loadingModule.show();
                this.searchByText($(this.searchInputField).val());
            }
            else if ($(this.searchInputField).val().trim().length == 0)
                this.searchByText("");
        }.bind(this))
        $(this.searchInputField).on("input", function (ev) {
            var inputVal = $(this.searchInputField).val();
            
            ev.preventDefault();
            if (inputVal.length > 1) {
                this.currWord = inputVal;
                setTimeout(function(input){
                    this.loadingModule.show();
                    if(input == this.currWord){
                        console.log("searching for: " + input);
                        this.searchByText(input);
                    }
                    
                }.bind(this, inputVal), 200);
            }
            else if (inputVal.trim().length == 0) 
                this.searchByText("");
        }.bind(this));
    }

    detectTypeOfPostsToShow () {
        if (this.postFetchData['TypeOfFetch'] != "PodcastSearch") {
            $(this.mainDiv).parent().find(".dropdownOfSlide").parent().hide();
            $(this.mainDiv).parent().find(".dropdownOfSlide").css("padding", 0).hide();
            $(this.mainDiv).parent().find(".main_search_container_post").css("padding", 0).hide();
            $(this.mainDiv).parent().find(".search-module-main").css("padding-top", 0);
            $(this.searchModule).css("border", "none");
            this.shouldAllowNewComments = false;
        }
        else {
            this.shouldAllowNewComments = true;
        }
    }

    generateNewPost(text, timeOfPost, slideOfPost) {
        var newPost = {
            "Name": this.userData["Name"],
            "PostId": "12312312", // get from callback
            "ProfilePic": this.userData["Pic"],
            "Content": text,
            "TimeOfPost": timeOfPost,
            "SlideOfPost": slideOfPost,
            "Comments": []
        };
        $(this.searchInputField).val("");
        this.searchByText("");
        this.loadPost(this, newPost, true);
    }

    searchForSlide (slideNo) {
        for (var x = 0; x < this.posts.length; x++)
            this.posts[x].fetchBySlide(slideNo);
    }

    setUpSlideTransitionModule () {
        loadHTMLComponent("SlideTransitionModule", function (data) {
            $(this.mainDiv).parent().find("#slide-transition-data").html(data);
        }.bind(this));
    }


    searchByText (text) {
        this.mark.unmark();
        var bm = new BoyMor(text.toUpperCase());

        this.currentTextBeingSearched = text;
        
        var anyPostsShown = false;
        for (var x = 0; x < this.posts.length; x++) {
            var hasPostsShown = this.posts[x].searchForContent(text);
            anyPostsShown = (anyPostsShown || hasPostsShown );
        }
        var audioResults = this.ocrModule.doSearchInAudio(text);
        var ocrResults = this.ocrModule.doSearchInOCR(text);
        anyPostsShown = anyPostsShown || audioResults || ocrResults;
        if (!anyPostsShown) {
            if (!$(this.noResultsOption).is(":visible"))
                $(this.noResultsOption).fadeIn(500);
        }
        else {
            this.mark.mark(text, { 
                "caseSensitive" : false, 
                "separateWordSearch" : false,
                "exclude": [".pre-slide-data", ".slide-no"]
            })
            $(this.noResultsOption).hide();
        }

        setTimeout(function () {
            this.loadingModule.hide(); 
        }.bind(this), 500);
        
    }

    remarkText () {
        if (this.currentTextBeingSearched != null) {
            this.mark.unmark();
            this.mark.mark(
                this.currentTextBeingSearched,
                {
                    "caseSensitive" : false,
                    "separateWordSearch" : false,
                     "exclude": [".pre-slide-data", ".slide-no"]
                }
            );
        }
    }

    loadPostsFromServer (thisClass) {
        var postData = this.postFetchData;

        // Default to podcast search assumption
        var apiURL = "./fake_data/getPosts.json";
        var requestData = {
            "PodcastID": postData["UniqueID"]
        };

        if (postData["TypeOfFetch"] == "CourseGlobal") {
            apiURL = "./fake_data/getPosts.json";
            requestData = {
                "CourseID": postData["UniqueID"]
            };
        }
        else if (postData["TypeOfFetch"] == "CourseSearch") {
            apiURL = "./fake_data/getPosts.json";
            requestData = {
                "CourseID": postData["UniqueID"],
                "SearchTerm": postData["SearchQuery"]
            };
        }
        callAPI(apiURL, "GET", requestData, function (data) {
            // An array of posts are returned
            for (var x = 0; x < data.length; x++) {
                thisClass.loadPost(thisClass, data[x]);
            }
        });
    }

    loadPostModuleData (callback) {
        loadHTMLComponent("PostModule", function (data) {
            callback(data);
        });
    }


    loadPost (thisClass, postData, shouldPrepend) {
        thisClass.loadPostModuleData(function (postTemplate) {
            var newDiv = $(postTemplate);
            var newPostObj = new APost(postData, thisClass.userData, newDiv, thisClass.shouldAllowNewComments);

            thisClass.posts.push(newPostObj);
            if (shouldPrepend)
                $(thisClass.mainDiv).prepend(newDiv);
            else
                $(thisClass.mainDiv).append(newDiv);

            // Must remark the text when a comment is added
            $(newDiv).on( "commentAdded", function() {
                thisClass.remarkText();
            });
        });

    }
    /*
    initAutocomplete() {
        var self = this;
        var apiURL = "./fake_data/getVideo.json";
        callAPI(apiURL, "GET", {}, function (data) {
            $.extend(autokeys, data["Keywords"]);
            console.log(autokeys);
            $("#secondary-search-bar").autocomplete({
                source: autokeys,
                minLength: 2,
                open: function () { 
                    $('ul.ui-autocomplete-post').removeClass('closed');
                    $('ul.ui-autocomplete-post').addClass('opened-post');  
                },
                close: function () {
                    $('ul.ui-autocomplete-post').removeClass('opened-post').css('display', 'block');
                    $('ul.ui-autocomplete-post').addClass('closed');
                },
            });
        });
        
        document.getElementById("secondary-search-bar").addEventListener("change", function() {
            var text = document.getElementById('secondary-search-bar').value.toLowerCase();
            if ($.inArray(text, autokeys) == -1)
                autokeys.push(text);
            console.log(autokeys);
        });                   
    }*/
}




