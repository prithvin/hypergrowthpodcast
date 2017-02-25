class CourseHomepageClass {
    constructor (courseId, mainDiv) {
        this.courseId = courseId;
        this.mainDiv = mainDiv;
        this.loadNavbar(this);
        this.loadCourseVideos(this);
        this.loadPostSearch(this);
    }
    
    loadNavbar (thisClass) {
        require(['navbar'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#navbox");
            loadComponent("MenuModule", divToLoad, function () {
                new NavBarLoggedInCourse(
                    divToLoad,
                    thisClass.courseId
                );
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
        });
        $(thisClass.mainDiv).bind("DOMSubtreeModified", function() {
            thisClass.updateComponentHeights();
        });
    }
  
    updateComponentHeights() {
        var newHeight =$(window).height() - $(this.mainDiv).find("#navbox").height();
        $(this.mainDiv).find("#course-posts").css("height", newHeight - 75);
        $(this.mainDiv).find("#course-videos").css("height", newHeight - 75);
    }
    
    
    loadPostSearch(thisClass) {
        require(['postSearch'], function () {
            var divToLoad = $(thisClass.mainDiv).find("#course-posts");
            loadComponent("PostSearchModule", divToLoad, function () {
                new PostSearch(
                    {
                        "UniqueID": 122,
                        "TypeOfFetch": "CourseGlobal"
                    },
                    {
                        "Name": thisClass.UserName, 
                        "Pic": thisClass.Pic
                    },
                    divToLoad
                );
                thisClass.dynamicWindowResize(thisClass);
            });
        });
    }
  
    loadCourseVideos(thisClass) {
      require(['course-videos'], function() {
        var divToLoad = $(thisClass.mainDiv).find("#course-videos");
        loadComponent("CourseVideosModule", divToLoad, function() {
            new CourseVideosClass(1, $(thisClass.mainDiv));
        });
      });
    }
}