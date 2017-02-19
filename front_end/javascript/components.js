window.appModules = {};

var loadHTMLModules = {
    "CommentModule": "comment_module.html",
    "CourseHomepageModule": "course_homepage_module.html",
    "CourseSearchModule": "course_search_module.html",
    "CourseVideosModule": "course_videos_module.html",
    "LoaderModule": "loader_module.html",
    "MenuModule": "menu_module.html",
    "OnboardingCourseTableModule": "onboarding_course_table_module.html",
    "OnboardingCoursesModule": "onboarding_courses_module.html",
    "OnboardingFrontPage": "onboarding_module.html",
    "PodcastModule": "podcast_module.html",
    "PostModule": "post_module.html",
    "PostSearchModule": "post_search_module.html",
    "VideoModule": "video_module.html"
};

function loadComponent (moduleName, divToLoad, callback) {
    if (loadHTMLModules[moduleName] == null) {
        console.log("Invalid module");
        return;
    }
    loadHTMLComponent(moduleName, function (data) {
        $(divToLoad).html(data);
        callback();
    });
}

function loadHTMLComponent (moduleName, callback) {

    if (window.appModules[moduleName] != null) 
        callback(window.appModules[moduleName]);
    
    var filePath = loadHTMLModules[moduleName]; 
    $.ajax({
        url: filePath,
        data: {},
        success: function (data) {
            window.appModules[moduleName] = data;
            callback(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Something went wrong when loading " + fileName);
            console.log("Status: " + textStatus + " Error: " + errorThrown);
        }  
    });
}


function callAPI (targetURL, type, callData, callback) {
    $.ajax({
        url: targetURL,
        data: callData,
        type: type,
        success: function (data) {
            callback(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.error("Something went wrong when loading " + targetURL);
            console.error("Status: " + textStatus + " Error: " + errorThrown);
        } 
    });
}



