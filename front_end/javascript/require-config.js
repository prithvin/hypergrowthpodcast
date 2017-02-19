var require = {
    baseUrl: 'javascript/',
    shim : {
        "bootstrap" : {
            "deps" :["jquery", "local_tether"]
        },
        "tether": {
            "deps": ['jquery'],
            "exports": "tether"
        },
        "local_tether": {
            "deps": ['jquery']
        },
        "jquery": {
            exports: '$'
        },
        "moment" : {
            "deps": ['jquery']
        },
        "markjs": {
            "deps": ['jquery']
        },
        "alertbox": {
            "deps": ['jquery']
        },
        "components": {
            "deps": ['jquery']
        },
        "postLoad": {
            "deps": ['alertbox', 'markjs', 'local_tether', 'moment', 'components']
        },
        "postSearch": {
            "deps": ['postLoad']
        },
        "videojs": {
            "deps": ['jquery']
        },
        "podcast": {
            "deps": ['postSearch', 'video-wrapper']
        },
        "video-wrapper": {
            "deps": ['videojs']
        },
        "director": {
            "deps": ['jquery', 'angular']
        },
        "loader": {},
        "angular": {},
        "navbar": {
            "deps": ['bootstrap']
        },
        "course-videos": {
            "deps": ['jquery', 'bootstrap']
        },
        "course-homepage": {
            "deps": ['course-videos', 'components']
        },
        "course-selection": {
            "deps": ['bootstrap', 'tether', 'components']
        },
        "searchResults":{
            "deps": ['angular', 'postSearch', 'navbar', 'bootstrap']
        }
    },
    // Note: Don't include the .js in the path
    paths: {
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "local_tether": "bootstrap_js/tether",
        "bootstrap" :  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min",
        "alertbox": "post_module/alertbox",
        "markjs": "post_module/mark",
        "postLoad": "post_module/postLoad",
        "postSearch": "post_module/postSearch",
        "components": "components",
        "director": "https://rawgit.com/flatiron/director/master/build/director.min",
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min",
        "videojs": "http://vjs.zencdn.net/5.16.0/video",
        "podcast": "podcast_module/podcast",
        "video-wrapper": "video_module/video",
        "loader": "loader_module/jsloader",
        "navbar": "menu_module/NavBarLoggedIn",
        "course-videos": "course_videos_module/course_videos",
        "course-homepage": "course_homepage_module/course_homepage",
        "course-selection": "onboarding_module/onboarding_courses",
        "onboarding": "onboarding_module/onboarding",
        "config": "config",
        "searchResults": "search_module/searchResults"
    }
};
