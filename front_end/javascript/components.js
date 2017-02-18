window.appModules = {};

var loadHTMLModules = {
    "CommentModule": "../comment_module.html",
    "CourseHomepageModule": "../course_homepage_module.html",
    "CourseSearchModule": "../course_search_module.html",
    "LoaderModule": "../loader_module.html",
    "MenuModule": "../menu_module.html",
    "OnboardingCourseTableModule": "../onboarding_course_table_module.html",
    "OnboardingCoursesModule": "../onboarding_courses_module.html",
    "PodcastModule": "../podcast_module.html",
    "PostModule": "../podcast_module.html",
    "PostSearchModule": "../post_search_module.html",
    "VideoModule": "../video_module.html"
};

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
          }
    });
}



