
var PostSearch = class PostSearch {
    constructor (postData, currentUserName, currentUserPic, currentUserAuthToken, mainDiv, shouldHideCommentsAndSearch) {
        this.currentUserName = currentUserName;
        this.currentUserPic = currentUserPic; 
        this.currentUserAuthToken = currentUserAuthToken;
        this.mainDiv = mainDiv;
        this.posts = [];
        this.currentSlide = 1;
        $(this.mainDiv).(".no-results").hide();
        this.shouldHideCommentsAndSearch = shouldHideCommentsAndSearch;

        if (this.shouldHideCommentsAndSearch) {
            $(this.mainDiv).parent().find(".dropdownOfSlide").hide();
            $(this.mainDiv).parent().find(".main_search_container_post").hide();
            $(this.mainDiv).parent().find(".search-module").css("border", "none");
            console.log($(this.mainDiv).parent().find(".search-module"));
        }

        this.mark = new Mark(document.getElementsByClassName("search-module")[0]);
        var parentClass = this;
        this.loadPostModuleData(function () {
            for (var x = 0; x < postData.length; x++) {
                parentClass.loadPost(postData[x]);
            }
        });

        var searchBar = $(this.mainDiv).prev();
        var inputField = $(searchBar).find("#secondary-search-bar");

        $(searchBar).on("submit", function (ev) {
            ev.preventDefault();
            parentClass.searchByText($(inputField).val())
        })
        $(inputField).on("input", function (ev) {
            ev.preventDefault();
            parentClass.searchByText($(inputField).val())
        })

        $(this.mainDiv).find(".all-posts-view").on("click", function (ev) {
            ev.preventDefault();
            parentClass.searchByText("");
        });

        $(this.mainDiv).prev().find(".new-post-img").on("click", function (ev) {
            var newPostVal = $(parentClass.mainDiv).prev().find("#secondary-search-bar").val();
            if (newPostVal.trim().length == 0)
                swal("Please ask a question to search for!");
            else 
                parentClass.generateNewPost(newPostVal, new Date().getTime(), parentClass.currentSlide); // <TODO> FIX THIS WITH CURRENT SLIDE
        });
    }

    generateNewPost(text, timeOfPost, slideOfPost) {
        var newPost = {
            "Name": this.currentUserName,
            "PostId": "12312312", // get from callback
            "ProfilePic": this.currentUserPic,
            "Content": text,
            "TimeOfPost": timeOfPost,
            "SlideOfPost": slideOfPost,
            "Comments": []
        };
        $(this.mainDiv).prev().find("#secondary-search-bar").val("");
        this.searchByText("");
        this.loadPost(newPost, true);
    }

    searchForSlide (slideNo) {
        for (var x = 0; x < this.posts.length; x++) {
            this.posts[x].fetchBySlide(slideNo);
        }
    }

    searchByText (text) {
        this.mark.unmark();
        jQuery.expr[':'].contains = function(a,i,m){
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };
        this.currentTextBeingSearched = text;
        this.mark.mark(text, { "caseSensitive" : false, "separateWordSearch" : false})
        var anyPostsShown = false;
        for (var x = 0; x < this.posts.length; x++) {
            var hasPostsShown = this.posts[x].searchForContent(text);
            anyPostsShown = (anyPostsShown || hasPostsShown );
        }
        if (!anyPostsShown) {
            if (!$(".no-results").is(":visible"))
                $(".no-results").fadeIn(500);
        }
        else {
            $(".no-results").hide();
        }
    }

    remarkText () {
        if (this.currentTextBeingSearched != null) {
            this.mark.unmark();
            this.mark.mark(this.currentTextBeingSearched, { "caseSensitive" : false, "separateWordSearch" : false})
        }
    }

    loadPostModuleData (callback) {
        if (this.componentData != null)  {
            callback(); 
            return; 
        }
        var parentClass = this;
        loadHTML("post_module.html", function (data) {
            parentClass.componentData = data;
            $(".hidden-post").html($(data));
            callback();
        });
    }

    loadPost (postData, prepend) {
        var parentClass = this;
        this.loadPostModuleData(function () {
            var newDiv = $(parentClass.componentData);
            var newPostObj = new APost(postData, parentClass.currentUserName, parentClass.currentUserPic, parentClass.currentUserAuthToken, newDiv, parentClass);
            parentClass.posts.push(newPostObj);
            if (prepend && prepend == true)
                parentClass.mainDiv.prepend(newDiv);
            else
                parentClass.mainDiv.append(newDiv);
        })
    }
}


