var require = {
    baseUrl: 'javascript/',
    waitSeconds: 60,
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
            "deps": ['postLoad',  'ocr_module', 'BoyerMoore', 'jquery', 'jquery-ui']
        },
        "videojs": {
            "deps": ['jquery'],
        },
        "podcast": {
            "deps": ['postSearch', 'video-wrapper']
        },
        "video-wrapper": {
            "deps": ['videojs', 'video_hotkeys']
        },
        "video_hotkeys":{
            "deps": ['videojs', 'local_tether']
        },
        "director": {
            "deps": ['jquery', 'angular']
        },
        "loader": {},
        "angular": {},
        "navbar": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui', 'auto-correct']
        },
        "course-videos": {
            "deps": ['jquery', 'bootstrap']
        },
        "search-videos": {
            "deps": ['jquery', 'bootstrap']
        },
        "course-homepage": {
            "deps": ['course-videos', 'components']
        },
        "course-selection": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui']
        },
        "searchResults":{
            "deps": ['angular', 'postSearch', 'navbar', 'bootstrap', 'search-videos']
        },
        "ocr_module": {
            "deps": ['jquery', 'ocr_txt_mod']
        },
        "ocr_txt_mod": {
            "deps": ['jquery']
        },
    },
    // Note: Don't include the .js in the path
    paths: {
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        "jquery-ui" : "https://code.jquery.com/ui/1.12.1/jquery-ui",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "local_tether": "bootstrap_js/tether",
        "bootstrap" :  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min",
        "alertbox": "post_module/alertbox",
        "markjs": "post_module/mark",
        "postLoad": "post_module/postLoad",
        "postSearch": "post_module/postSearch",
        "BoyerMoore": "post_module/BoyerMoore",
        "components": "components",
        "director": "https://rawgit.com/flatiron/director/master/build/director.min",
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min",
        "videojs": "http://vjs.zencdn.net/5.16.0/video",
        "video_hotkeys":"https://cdn.sc.gl/videojs-hotkeys/0.2/videojs.hotkeys.min",
        "podcast": "podcast_module/podcast",
        "video-wrapper": "video_module/video",
        "loader": "loader_module/jsloader",
        "navbar": "menu_module/NavBarLoggedIn",
        "course-videos": "course_videos_module/course_videos",
        "course-homepage": "course_homepage_module/course_homepage",
        "course-selection": "onboarding_module/onboarding_courses",
        "onboarding": "onboarding_module/onboarding",
        "config": "config",
        "searchResults": "search_module/searchResults",
        "search-videos": "search_module/search-videos",
        "ocr_module": "post_module/ocr_audio_parse",
        "ocr_txt_mod": "post_module/text_ocr_audio_parse",
        "auto-correct": "post_module/Norvig",
        "search-results": "search_module/search-results"
    }
};
