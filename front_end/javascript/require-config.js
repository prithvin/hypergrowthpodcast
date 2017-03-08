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
            "deps": ['jquery', 'config', 'garbageBin']
        },
        "postLoad": {
            "deps": ['alertbox', 'markjs', 'local_tether', 'moment', 'components']
        },
        "postSearch": {
            "deps": ['postLoad',  'ocr_module', 'BoyerMoore', 'jquery', 'jquery-ui', 'navbar', "notes", 'post-dropdown', 'scrollreveal']
        },
        "notes":{
            "deps":["jquery"]
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
        "post-dropdown": {},
        "navbar": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui', 'facebook']
        },
        "course-videos": {
            "deps": ['jquery', 'bootstrap', 'moment']
        },
        "search-videos": {
            "deps": ['jquery', 'bootstrap', 'search-card']
        },
        "course-homepage": {
            "deps": ['course-videos', 'components']
        },
        "course-selection": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui', 'config']
        },
        "searchResults":{
            "deps": ['angular', 'postSearch', 'navbar', 'bootstrap', 'search-videos', 'search-card', 'boardz']
        },
        "ocr_module": {
            "deps": ['jquery', 'ocr_txt_mod']
        },
        "ocr_txt_mod": {
            "deps": ['jquery']
        },
        'facebook' : {
            "exports": 'FB'
        },
        'onboarding': {
            "deps": ['facebook', 'jquery', 'alertbox']
        },
        'scrollreveal': {},
        'search-card': {
        }
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
        "notes": "notes_module/notes",
        "components": "components",
        "director": "https://rawgit.com/flatiron/director/master/build/director.min",
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min",
        "videojs": "https://vjs.zencdn.net/5.16.0/video",
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
        "post-dropdown": "post_module/PodcastDropdownMenu",
        "search-results": "search_module/search-results",
        "recommendations": "recommendations_module/recommendations",
        'facebook': '//connect.facebook.net/en_US/sdk',
        'scrollreveal': 'https://unpkg.com/scrollreveal/dist/scrollreveal.min',
        'search-card': "search_module/search_card",
        'boardz': 'search_module/boardz',
        'garbageBin': 'garbage-collector'
    }
};
