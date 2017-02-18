var require = {
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
            "deps": ['alertbox', 'markjs', 'moment', 'components']
        },
        "postSearch": {
            "deps": ['postLoad']
        },
        "director": {
            "deps": ['jquery', 'angular']
        },
        "angular": {}
    },
    paths: {
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "local_tether": "./bootstrap_js/tether",
        "bootstrap" :  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min",
        "alertbox": "./post_module/alertbox",
        "markjs": "./post_module/mark",
        "postLoad": "./post_module/postLoad",
        "postSearch": "./post_module/postSearch",
        "components": "./components",
        "director": "https://rawgit.com/flatiron/director/master/build/director.min",
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min"
    }
};
