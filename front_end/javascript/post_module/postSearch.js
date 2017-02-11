var PostSearch = class PostSearch {
    constructor (postData, currentUserName, currentUserPic, currentUserAuthToken, mainDiv) {
        this.currentUserName = currentUserName;
        this.currentUserPic = currentUserPic; 
        this.currentUserAuthToken = currentUserAuthToken;
        this.mainDiv = mainDiv;
        this.posts = [];

        this.mark = new Mark(document.getElementsByClassName("search-module")[0]);
        var parentClass = this;
        this.loadPostModuleData(function () {
            for (var x = 0; x < postData.length; x++) {
                parentClass.loadPost(postData[x]);
            }
        });
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
        this.mark.mark(text, { "caseSensitive" : false})
        for (var x = 0; x < this.posts.length; x++) {
            this.posts[x].searchForContent(text);
        }
    }

    remarkText () {
        if (this.currentTextBeingSearched != null) {
            this.mark.unmark();
            this.mark.mark(this.currentTextBeingSearched, { "caseSensitive" : false})
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

    loadPost (postData) {
        var parentClass = this;
        this.loadPostModuleData(function () {
            var newDiv = $(parentClass.componentData);
            var newPostObj = new APost(postData, parentClass.currentUserName, parentClass.currentUserPic, parentClass.currentUserAuthToken, newDiv, parentClass);
            parentClass.posts.push(newPostObj);
            parentClass.mainDiv.append(newDiv);
        })
    }
}


