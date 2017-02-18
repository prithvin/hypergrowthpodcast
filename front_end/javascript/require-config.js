var config = {
    shim : {
        "bootstrap" : {
            "deps" :["jquery"] 
        },
        "tether": {
            "deps": ['jquery'],
            "exports": "tether"
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
        }
    },
    paths: {
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "bootstrap" :  "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min",
        "alertbox": "./post_module/alertbox",
        "markjs": "./post_module/mark",
        "postLoad": "./post_module/postLoad",
        "postSearch": "./post_module/postSearch",
        "components": "./components"
    }
};

require.config(config);

require(['tether'], function (Tether) {
    window.Tether = Tether;
});