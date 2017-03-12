var SearchPage = class SearchPage {

    constructor (podcastID, mainDiv, searchTerm) {
        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.searchTerm = searchTerm;
        this.loadNavbar(this);
        this.loadVideos(this);
        this.loadPosts(this);
    }

    loadNavbar (thisClass) {
        require(['navbar'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#navbox");
            loadComponent("MenuModule", divToLoad, function () {
                var navbar = new NavBarLoggedInCourse(
                    divToLoad,
                    thisClass.podcastID
                );
                navbar.setValueOfSearchBar(thisClass.searchTerm);
            });
        });

    }

    loadPosts (thisClass) {
        require(['postSearch'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#posts");
            /*loadComponent("PostSearchModule", divToLoad, function () {
                new PostSearch(
                    {
                        "UniqueID": thisClass.podcastID,
                        "TypeOfFetch": "CourseSearch",
                        "SearchQuery" : thisClass.searchTerm
                    },
                    {
                        "Name": thisClass.UserName,
                        "Pic": thisClass.UserPic
                    },
                    divToLoad
                );
                thisClass.dynamicWindowResize(thisClass);
            });*/
        });
    }

    loadVideos(thisClass) {
      require(['search-videos'], function() {
        var divToLoad = $(thisClass.mainDiv).find("#search-videos");
        loadComponent("SearchResultsModule", divToLoad, function() {
            new SearchVideosClass(thisClass.podcastID, $(thisClass.mainDiv), thisClass.searchTerm); 
        });
      });
    }
    
    dynamicWindowResize (thisClass) {
        $(window).on("resize", function() {
            if ($(thisClass.mainDiv).length == 0) {
                $('#myimage').off('click.mynamespace');
            }
            else {
                thisClass.updateComponentHeights();
            }
        })
        $(thisClass.mainDiv).bind("DOMSubtreeModified", function() {
            thisClass.updateComponentHeights();
        });
    }

    updateComponentHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#posts").css("height", newHeight - 35);
        $(this.mainDiv).find("#search-videos").css("height", newHeight + 115);
    }

};