window.appModules = {};

var loadHTMLModules = {
    "CommentModule": "comment_module.html",
    "CourseHomepageModule": "course_homepage_module.html",
    "CourseSearchModule": "course_search_module.html",
    "SearchResultsModule": "search_videos_module.html",
    "CourseVideosModule": "course_videos_module.html",
    "LoaderModule": "loader_module.html",
    "MenuModule": "menu_module.html",
    "OnboardingCoursesModule": "onboarding_courses_module.html",
    "OnboardingFrontPage": "onboarding_module.html",
    "PodcastModule": "podcast_module.html",
    "PostModule": "post_module.html",
    "PostSearchModule": "post_search_module.html",
    "VideoModule": "video_module.html",
    "AudioOCRSubMod": "audio_ocr_search_sub_module.html",
    "AudioOCRMod": "audio_ocr_search_module.html",
    "SlideTransitionModule": "slide_transition_module.html",
    "RecommendationsModule": "recommendations_module.html",
    "NotesModule": "notes_module.html"
};

preloadComponents();
function preloadComponents() {
    for (var key in loadHTMLModules) {
        loadHTMLComponent(key, function () {});
    }
}

function loadComponent(moduleName, divToLoad, callback) {
    if (loadHTMLModules[moduleName] === undefined) {
        console.log("Invalid module");
        return;
    }
    loadHTMLComponent(moduleName, function (data) {
        $(divToLoad).html(data);
        callback();
    });
}

function loadComponentOrLogin(moduleName, divToLoad, callback) {
    callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, function (loginStatus) {
        if (loginStatus.result === true) {
            loadComponent(moduleName, divToLoad, callback);
        } else {
            window.location.href = window.location.origin + window.location.pathname + '/#/?redirectURL=' + encodeURIComponent(window.location.href);
        }
    });
}

function loadHTMLComponent(moduleName, callback) {

    if (window.appModules[moduleName] !== undefined) {
        callback(window.appModules[moduleName]);
        return;
    }

    var filePath = loadHTMLModules[moduleName];

    $.ajax({
        url: filePath,
        data: {},
        success: function success(data) {
            window.appModules[moduleName] = data;
            callback(data);
        },
        error: function error(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Something went wrong when loading " + fileName);
            console.log("Status: " + textStatus + " Error: " + errorThrown);
        }
    });
}

function callAPI(targetURL, type, callData, callback) {
    $.ajax({
        url: targetURL,
        data: callData,
        type: type,
        xhrFields: {
            withCredentials: true
        },
        success: function success(data) {
            callback(data);
        },
        error: function error(XMLHttpRequest, textStatus, errorThrown) {
            console.error("Something went wrong when loading " + targetURL);
            console.error("Status: " + textStatus + " Error: " + errorThrown);
        }
    });
}

// GLOBAL JQUERY OVERRIDE
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
"use strict";

var login_origins = {
  //backend: "http://" + window.location.hostname + ':3000'
  backend: "http://104.131.147.159:3000"
};
"use strict";

var _require = {
    baseUrl: 'javascript/',
    shim: {
        "bootstrap": {
            "deps": ["jquery", "local_tether"]
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
        "moment": {
            "deps": ['jquery']
        },
        "markjs": {
            "deps": ['jquery']
        },
        "alertbox": {
            "deps": ['jquery']
        },
        "components": {
            "deps": ['jquery', 'config']
        },
        "postLoad": {
            "deps": ['alertbox', 'markjs', 'local_tether', 'moment', 'components']
        },
        "postSearch": {
            "deps": ['postLoad', 'ocr_module', 'BoyerMoore', 'jquery', 'jquery-ui', 'navbar', "notes", 'post-dropdown']
        },
        "notes": {
            "deps": ["jquery"]
        },
        "videojs": {
            "deps": ['jquery']
        },
        "podcast": {
            "deps": ['postSearch', 'video-wrapper']
        },
        "video-wrapper": {
            "deps": ['videojs', 'video_hotkeys']
        },
        "video_hotkeys": {
            "deps": ['videojs', 'local_tether']
        },
        "director": {
            "deps": ['jquery', 'angular']
        },
        "loader": {},
        "angular": {},
        "post-dropdown": {},
        "navbar": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui']
        },
        "course-videos": {
            "deps": ['jquery', 'bootstrap', 'moment']
        },
        "search-videos": {
            "deps": ['jquery', 'bootstrap']
        },
        "course-homepage": {
            "deps": ['course-videos', 'components']
        },
        "course-selection": {
            "deps": ['bootstrap', 'jquery', 'jquery-ui', 'config']
        },
        "searchResults": {
            "deps": ['angular', 'postSearch', 'navbar', 'bootstrap', 'search-videos']
        },
        "ocr_module": {
            "deps": ['jquery', 'ocr_txt_mod']
        },
        "ocr_txt_mod": {
            "deps": ['jquery']
        }
    },
    // Note: Don't include the .js in the path
    paths: {
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min",
        "jquery-ui": "https://code.jquery.com/ui/1.12.1/jquery-ui",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "local_tether": "bootstrap_js/tether",
        "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min",
        "moment": "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min",
        "alertbox": "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min",
        "markjs": "https://cdn.jsdelivr.net/mark.js/8.8.3/mark",
        "postLoad": "post_module/postLoad",
        "postSearch": "post_module/postSearch",
        "BoyerMoore": "post_module/BoyerMoore",
        "notes": "notes_module/notes",
        "components": "components",
        "director": "https://rawgit.com/flatiron/director/master/build/director.min",
        "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min",
        "videojs": "http://vjs.zencdn.net/5.16.0/video",
        "video_hotkeys": "https://cdn.sc.gl/videojs-hotkeys/0.2/videojs.hotkeys.min",
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
        "recommendations": "recommendations_module/recommendations"
    }
};
"use strict";

function redirectToAuth() {
  window.location.port = 3000;
}

function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

var query_str = window.location.search.substring(1);
//Map-reduce queries into a single object
var queries = query_str.split('&').map(function (q) {
  var parts = q.split('=');
  var key = parts[0];
  var val = parts[1];
  var query = {};
  query[key] = val;
  return query;
}).reduce(function (acc_obj, q) {
  var key = Object.keys(q)[0];
  acc_obj[key] = q[key];
  return acc_obj;
}, {});

if (!queries.hasOwnProperty('id')) redirectToAuth();else {
  var id = queries['id'];
  if (!readCookie('fb_id')) createCookie('fb_id', id, 7);

  //redirect
  window.location.href = '/onboarding_courses_module.html';
}
'use strict';

define(['tether', 'moment', 'videojs'], function (tether, moment, videojs) {
    window.Tether = tether;
    window.moment = moment;
    window.videojs = videojs;
    //window.video_hotkeys = video_hotkeys;
    return tether;
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CourseHomepageClass = function () {
    function CourseHomepageClass(courseId, mainDiv, loadingCallback) {
        _classCallCheck(this, CourseHomepageClass);

        this.courseId = courseId;
        this.mainDiv = mainDiv;
        this.loadingCallback = loadingCallback;
        this.loadNavbar(this);
        this.loadCourseVideos(this);
        this.loadPostSearch(this);
    }

    _createClass(CourseHomepageClass, [{
        key: "loadNavbar",
        value: function loadNavbar(thisClass) {
            require(['navbar'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#navbox");
                loadComponent("MenuModule", divToLoad, function () {
                    new NavBarLoggedInCourse(divToLoad, thisClass.courseId);
                });
            });
        }
    }, {
        key: "dynamicWindowResize",
        value: function dynamicWindowResize(thisClass) {
            $(window).on("resize", function () {
                if ($(thisClass.mainDiv).length == 0) {
                    $('#myimage').off('click.mynamespace');
                } else {
                    thisClass.updateComponentHeights();
                }
            });
            $(thisClass.mainDiv).bind("DOMSubtreeModified", function () {
                thisClass.updateComponentHeights();
            });
        }
    }, {
        key: "updateComponentHeights",
        value: function updateComponentHeights() {
            var newHeight = $(window).height() - $(this.mainDiv).find("#navbox").height();
            $(this.mainDiv).find("#course-posts").css("height", newHeight - 35);
            $(this.mainDiv).find("#course-videos").css("height", newHeight - 35);
        }
    }, {
        key: "loadPostSearch",
        value: function loadPostSearch(thisClass) {

            require(['postSearch'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#course-posts");
                loadComponent("PostSearchModule", divToLoad, function () {
                    new PostSearch({
                        "UniqueID": thisClass.courseId,
                        "TypeOfFetch": "CourseGlobal"
                    }, {
                        "Name": thisClass.UserName,
                        "Pic": thisClass.Pic
                    }, divToLoad);
                    thisClass.dynamicWindowResize(thisClass);
                });
            });
        }
    }, {
        key: "loadCourseVideos",
        value: function loadCourseVideos(thisClass) {
            require(['course-videos'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#course-videos");
                loadComponent("CourseVideosModule", divToLoad, function () {
                    new CourseVideosClass(thisClass.courseId, $(thisClass.mainDiv), thisClass.loadingCallback);
                });
            });
        }
    }]);

    return CourseHomepageClass;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CourseVideosClass = function CourseVideosClass(courseId, mainDiv, loadingCallback) {
  _classCallCheck(this, CourseVideosClass);

  this.courseId = courseId;
  this.mainDiv = mainDiv;
  this.loadingCallback = loadingCallback;

  callAPI(login_origins.backend + '/getVideosForCourse', 'GET', { 'CourseId': courseId }, function (data) {
    var masterDiv = document.getElementById('course-videos-div');
    var row = document.createElement('div');
    row.className = 'row videos-row';
    masterDiv.appendChild(row);

    var videos = data['Videos'];
    for (var i = 0; i < videos.length; i++) {
      var curr = videos[i];

      if (row.childElementCount == 3) {
        row = document.createElement('div');
        row.className = 'row videos-row';
        masterDiv.appendChild(row);
      }
      var videoDiv = document.createElement('div');
      videoDiv.className = 'col-4';
      row.appendChild(videoDiv);

      var img = document.createElement('img');
      img.className = 'course-videos-preview-images';
      img.src = curr['PreviewImage'];
      img.addEventListener('click', function () {
        window.location.hash = '#/podcast/' + this['Id'];
      }.bind(curr));
      videoDiv.appendChild(img);

      var heading = document.createElement('p');
      heading.align = 'center';
      //var date = new Date(curr['Time']);
      heading.innerHTML = moment(curr['Time']).format("ddd, M/D"); //date.toLocaleDateString();
      heading.className = 'text-title';
      videoDiv.appendChild(heading);
    }
    this.loadingCallback();
  }.bind(this));
};
"use strict";

function loadJavascriptDynamically(arr, callback) {
    loadJSDynamicallyHelper(arr, 0, callback);
}

function loadJSDynamicallyHelper(arr, index, callback) {
    if (index == arr.length) {
        callback();
        return;
    }
    $.getScript(arr[index], function (data, textStatus, jqxhr) {
        if (textStatus != "success") {
            console.error(arr[index] + " failed to load");
        }
        loadJSDynamicallyHelper(arr, index + 1, callback);
    });
}

function loadCSSDynamically(url) {
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: url
    });
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var autokeys = [];
var NavBarLoggedInCourse = function () {

    // ClassID COULD EITHER BE A PODCAST OR A CLASSID IT CAN BE SOMETHINg. 
    function NavBarLoggedInCourse(mainDiv, classID) {
        _classCallCheck(this, NavBarLoggedInCourse);

        this.mainDiv = mainDiv;
        this.classID = classID;

        var self = this;
        this.fetchUserData(function (userName, userPic) {
            self.setUserName(userName);
            self.setProfPic(userPic);
        });

        this.fetchCourseData(classID, function (className, classQuarter) {
            self.setClassName(className);
            self.setClassQuarter(classQuarter);
            self.setPlaceHolder(className, classQuarter);
        });
        this.setHomeHyperLink();
    }

    _createClass(NavBarLoggedInCourse, [{
        key: 'fetchCourseData',
        value: function fetchCourseData(classID, callback) {
            callAPI(login_origins.backend + '/getCourseInfo', 'GET', { 'CourseId': classID }, function (data) {
                var qtr = data['Quarter'];
                if (qtr.indexOf("fa") > -1) qtr = "Fall " + qtr.slice(-2);
                if (qtr.indexOf("wi") > -1) qtr = "Winter " + qtr.slice(-2);
                if (qtr.indexOf("sp") > -1) qtr = "Spring " + qtr.slice(-2);
                if (qtr.indexOf("s2") > -1) qtr = "SS2 " + qtr.slice(-2);
                if (qtr.indexOf("s1") > -1) qtr = "SS1 " + qtr.slice(-2);
                callback(data['Course'], qtr);

                this.classID = data['Id'];
                this.setCoursesHyperLink(data['Id']);
                this.listenToUserSearch();
                this.initAutocomplete(data['Id']);
            }.bind(this));
        }
    }, {
        key: 'listenToUserSearch',
        value: function listenToUserSearch() {
            $(this.mainDiv).find(".main_search_container").on("submit", function (ev) {
                ev.preventDefault();
                if ($(this.mainDiv).find("#searchBar").val().trim().length != 0) window.location.hash = "#/search/" + this.classID + "/" + encodeURIComponent($(this.mainDiv).find("#searchBar").val());
            }.bind(this));
        }
    }, {
        key: 'fetchUserData',
        value: function fetchUserData(callback) {
            callAPI(login_origins.backend + '/getUser', "GET", {}, function (data) {
                callback(data['Name'], data['Pic']);
                this.initLogout(data['Name']);
            }.bind(this));
        }
    }, {
        key: 'setClassName',
        value: function setClassName(className) {
            $(this.mainDiv).find("#className").html(className);
        }
    }, {
        key: 'setClassQuarter',
        value: function setClassQuarter(classQuarter) {
            $(this.mainDiv).find("#classQuarter").html(classQuarter);
        }
    }, {
        key: 'setPlaceHolder',
        value: function setPlaceHolder(className, classQuarter) {
            $(this.mainDiv).find("#searchBar").attr("placeholder", "Search in " + className + " " + classQuarter);
        }
    }, {
        key: 'setValueOfSearchBar',
        value: function setValueOfSearchBar(newValue) {
            $(this.mainDiv).find("#searchBar").val(newValue);
        }
    }, {
        key: 'setUserName',
        value: function setUserName(userFirstName) {
            $(this.mainDiv).find("#firstName").html(userFirstName.substring(0, userFirstName.indexOf(' ')));
        }
    }, {
        key: 'setProfPic',
        value: function setProfPic(userPicture) {
            $(this.mainDiv).find("#userProfPic").attr("src", userPicture);
        }
    }, {
        key: 'setCoursesHyperLink',
        value: function setCoursesHyperLink(classId) {
            $(this.mainDiv).find("#course_button").on("click", function () {
                var windowHash = "#/courses/" + classId;
                if (classId == null) {
                    windowHash = "#/courses";
                }
                window.location.hash = windowHash;
            });
        }
    }, {
        key: 'setHomeHyperLink',
        value: function setHomeHyperLink() {
            var windowHash = "#/courses";
            $(this.mainDiv).find("#home_button").on("click", function () {
                window.location.hash = windowHash;
            }.bind(this));
            $(this.mainDiv).find("#home_button2").on("click", function () {
                window.location.hash = windowHash;
            }.bind(this));
        }
    }, {
        key: 'initAutocomplete',
        value: function initAutocomplete(classID) {
            // Keep user searches if they are worthwhile
            document.getElementById("searchBar").addEventListener("change", function () {
                var text = document.getElementById('searchBar').value.toLowerCase();
                if ($.inArray(text, autokeys) == -1 && text.length > 2) autokeys.push(text);
                //console.log(autokeys);
                localStorage.setItem("autokeys", autokeys);
            });

            if (classID == null) {
                return; // we don't want a podcast id here so exit!
            }

            // Get Keywords for entire course
            callAPI(login_origins.backend + '/getKeywordSuggestions', "GET", { 'count': 100, 'minKeywordLength': 3, 'CourseId': classID }, function (data) {
                var keys = localStorage.getItem("autokeys");
                if (keys !== null) autokeys = keys.split(",");
                // Merge keywords
                $.extend(autokeys, data);
                $("#searchBar").autocomplete({
                    source: autokeys,
                    minLength: 1,
                    open: function open() {
                        $('ul.ui-autocomplete').addClass('opened');
                    },
                    close: function close() {
                        $('ul.ui-autocomplete').removeClass('opened').css('display', 'block');
                    }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    return $("<li class='li-key'></li>").data("item.autocomplete", item).append("<span class='key'>" + item.label + "</span>").appendTo(ul);;
                };
            });
        }
    }, {
        key: 'initLogout',
        value: function initLogout(name) {
            var self = this;
            $('.logout-container').hover(function () {
                $('#name-logout').fadeOut('fast', function () {
                    $('#name-logout').text('Logout?').fadeIn('fast');
                });
                $("#name-logout").css({ "cursor": "pointer" });
            }, function () {
                $('#name-logout').fadeOut('fast', function () {
                    $('#name-logout').text("Hey " + name.substring(0, name.indexOf(' ')) + "!").fadeIn('fast');
                });
            });
            $('#name-logout').click(function () {
                self.logout();
            });
        }
    }, {
        key: 'logout',
        value: function logout() {
            callAPI(login_origins.backend + '/logout', 'GET', {}, function (data) {
                //Redirect User to Login
                window.location.hash = '/';
            });
        }
    }]);

    return NavBarLoggedInCourse;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notes = function () {
    function Notes(mainDiv, text, podcastid) {
        _classCallCheck(this, Notes);

        this.text = text;
        this.mainDiv = mainDiv;
        this.podcastid = podcastid;

        this.getTime();
        this.initListeners();
        if (!text) text = "";
        if (text.length > 0) {
            this.mainDiv.find('.notes-content').text(text);
        }
    }

    _createClass(Notes, [{
        key: "getTime",
        value: function getTime() {
            var today = new Date();
            this.month = today.getMonth();
            this.day = today.getDate();
            this.hour = today.getHours();
            this.min = today.getMinutes();

            if (this.hour < 12) {
                this.ap = "AM";
            } else {
                this.ap = "PM";
                this.hour -= 12;
            }
            if (this.hour == 0) {
                this.hour = 12;
            }
            this.month = this.checkTime(this.month);
            this.day = this.checkTime(this.day);
        }
    }, {
        key: "checkTime",
        value: function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }, {
        key: "initListeners",
        value: function initListeners() {
            this.mainDiv.find('.notes-content').keydown(function (event) {
                if (event.keyCode == 9) {
                    //add tab
                    document.execCommand('insertHTML', false, '&#009');
                    //prevent focusing on next element
                    event.preventDefault();
                }
            }.bind(this));

            this.mainDiv.find('.save').click(function () {

                var textToSave = $(".notes-content")[0].innerText;
                if (!textToSave) {
                    textToSave = $(".notes-content").html().trim().replace(/<br\s*\/*>/ig, '\n').replace(/(<(p|div))/ig, '\n$1').replace(/(<([^>]+)>)/ig, "");
                }

                if (textToSave != this.text) {
                    var obj = {
                        "PodcastId": this.podcastid,
                        "Content": textToSave
                    };
                    callAPI(login_origins.backend + "/createNotes", "POST", obj, function (postID) {
                        this.text = textToSave;
                        this.getTime();
                        $('.comment').html('Last updated on ' + this.month + '/' + this.day + ' at ' + this.hour + ":" + this.min + " " + this.ap);
                    }.bind(this));
                }
            }.bind(this));
        }
    }]);

    return Notes;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Onboarding = function () {
  function Onboarding(mainDiv) {
    _classCallCheck(this, Onboarding);

    console.log(mainDiv);
    var queries;
    var query_str = window.location.search.substring(1);
    if (!query_str) {
      var query_start = window.location.href.indexOf('?');
      if (query_start > 0) {
        query_str = window.location.href.substring(query_start + 1);
        queries = this.getQueries(query_str);
      }
    } else {
      queries = this.getQueries(query_str);
    }

    $(mainDiv).find('.fb-login-button').on("click", function () {
      var baseURL = window.location.origin + window.location.pathname;
      var targetCallbackURL = encodeURIComponent(baseURL + "#/courses");
      var errorCallbackURL = encodeURIComponent(baseURL + "#");
      window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
    });

    if (queries && queries.hasOwnProperty('redirectURL')) {
      callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, function (data) {
        if (!data.result) {
          var baseURL = window.location.origin + window.location.pathname;
          var targetCallbackURL = encodeURIComponent(baseURL + '#/?redirectURL=' + queries['redirectURL']);
          var errorCallbackURL = encodeURIComponent(baseURL + "#");
          window.location.href = login_origins.backend + '/auth/facebook?callbackURL=' + targetCallbackURL + '&errorCallbackURL=' + errorCallbackURL;
        } else {
          window.location.href = decodeURIComponent(queries['redirectURL']);
        }
      });
    } else {
      callAPI(login_origins.backend + '/isUserLoggedIn', 'GET', {}, function (data) {
        if (data.result === true) {
          window.location.hash = '/courses';
        } else {
          callAPI(login_origins.backend + '/getUserSession', 'GET', {}, function (data) {
            if (data['user']) {
              callAPI(login_origins.backend + '/setUserFromSession', 'GET', {}, function (data) {
                window.location.hash = '/courses';
              });
            }
          });
        }
      });
    }
  }

  _createClass(Onboarding, [{
    key: 'getQueries',
    value: function getQueries(query_str) {
      //Map-reduce queries into a single object
      var queries = query_str.split('&').map(function (q) {
        var parts = q.split('=');
        var key = parts[0];
        var val = parts[1];
        var query = {};
        query[key] = val;
        return query;
      }).reduce(function (acc_obj, q) {
        var key = Object.keys(q)[0];
        acc_obj[key] = q[key];
        return acc_obj;
      }, {});

      return queries;
    }
  }]);

  return Onboarding;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OnboardingCourses = function () {
  function OnboardingCourses(mainDiv) {
    _classCallCheck(this, OnboardingCourses);

    this.tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    this.fetchCourses();
  }

  _createClass(OnboardingCourses, [{
    key: 'fetchCourses',
    value: function fetchCourses() {
      var apiURL = login_origins.backend + "/getCourses";
      callAPI(apiURL, "GET", {}, function (data) {
        this.loadCourses(data);
      }.bind(this));
    }
  }, {
    key: 'loadCourses',
    value: function loadCourses(data) {
      for (var i = 0; i < data.length; i++) {
        var row = this.tableRef.insertRow(this.tableRef.rows.length);
        var cell = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell.className = 'cell cell-end';
        cell2.className = 'cell cell-mid';
        cell3.className = 'cell cell-end';
        row.className = 'table-row';
        row.id = data[i]['Id'];

        row.addEventListener("click", function () {
          var baseURL = window.location.origin + window.location.pathname;
          var targetURL = baseURL + "#/courses/" + this.id;
          window.location.href = targetURL;
          window.location.hash = "/courses/" + this.id;
        });

        var course = document.createTextNode(data[i]['Course']);
        var qtr = data[i]['Quarter'];
        if (qtr.indexOf("fa") > -1) qtr = "Fall " + qtr.slice(-2);
        if (qtr.indexOf("wi") > -1) qtr = "Winter " + qtr.slice(-2);
        if (qtr.indexOf("sp") > -1) qtr = "Spring " + qtr.slice(-2);
        if (qtr.indexOf("s2") > -1) qtr = "SS2 " + qtr.slice(-2);
        if (qtr.indexOf("s1") > -1) qtr = "SS1 " + qtr.slice(-2);
        var quarter = document.createTextNode(qtr);
        var sym = document.createElement('i');
        sym.setAttribute('aria-hidden', 'true');
        sym.className = 'fa fa-graduation-cap sym'; //fa-graduation-cap
        cell.appendChild(course);
        cell2.appendChild(sym);
        cell3.appendChild(quarter);
      }
    }
  }]);

  return OnboardingCourses;
}();

/* Search Function */
function myFunction() {
  var input, filter, table, tr, td, td1, td2, i;
  input = document.getElementById("searchBar1");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  var count = 0;
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    td1 = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    if (td && td1 && td2) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1 || td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
        count++;
      }
    }
  }
  if (count == tr.length - 1) {
    // No results
    $('.no-results-courses').addClass('no-results-show');
  } else {
    $('.no-results-courses').removeClass('no-results-show');
  }
}

/* Sort Function */
function sortTable(n) {
  var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PodcastPage = function () {
    function PodcastPage(podcastID, mainDiv, startingSlide, loadingCallback) {
        _classCallCheck(this, PodcastPage);

        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.startingSlide = startingSlide;
        this.loadingCallback = loadingCallback;
        if (!this.startingSlide) this.startingSlide = 1;
        this.fetchUserData(this);
        this.loadNavbar(this);
        this.loadRecommendations(mainDiv);
    }

    _createClass(PodcastPage, [{
        key: 'fetchUserData',
        value: function fetchUserData(thisClass) {
            callAPI(login_origins.backend + '/getUser', "GET", {}, function (data) {
                thisClass.UserName = data['Name'];
                thisClass.UserPic = data['Pic'];
                thisClass.fetchVideo(thisClass);
            });
        }
    }, {
        key: 'parseSlides',
        value: function parseSlides(slides) {
            // Note that the slides themselves are indexed starting at 1
            var slideTimes = [];
            for (var x = 0; x < slides.length; x++) {
                slideTimes.push(slides[x]["StartTime"] / 1000);
            }
            this.slideTimes = slideTimes;
        }
    }, {
        key: 'getTimeForSlide',
        value: function getTimeForSlide(slideNum) {
            if (slideNum <= 0) {
                console.error("Remember that slide numbers start at 1, not 0");
                return 0;
            }
            slideNum -= 1;
            if (slideNum >= this.slideTimes.length) return 0;else return this.slideTimes[slideNum];
        }
    }, {
        key: 'getSlideForTime',
        value: function getSlideForTime(timeValueInSeconds) {
            var targetSlide = this.getSlideForTimeHelper(this.slideTimes, function (x) {
                return x - timeValueInSeconds;
            });
            return targetSlide + 1; // slides start at index 1!!
        }
    }, {
        key: 'getSlideForTimeHelper',
        value: function getSlideForTimeHelper(arr, compare) {
            var l = 0,
                r = arr.length - 1;
            while (l <= r) {
                var m = l + (r - l >> 1);
                var comp = compare(arr[m]);
                if (comp < 0) // arr[m] comes before the element
                    l = m + 1;else if (comp > 0) // arr[m] comes after the element
                    r = m - 1;else // arr[m] equals the element
                    return m;
            }
            return l - 1; // return the index of the next left item
            // usually you would just return -1 in case nothing is found
        }
    }, {
        key: 'getSlideClicks',
        value: function getSlideClicks() {
            $(this.mainDiv).on("click", ".slide-no", function (ev) {
                var target = ev.currentTarget;
                var slideNo = $(ev.currentTarget).attr("data-slide");
                var slideTime = $(ev.currentTarget).attr("data-time");
                if (slideTime) this.videoClass.setTime(slideTime);else {
                    this.videoClass.setTime(this.getTimeForSlide(slideNo));
                }
                this.postSearch.updateCurrentVideoSlide(slideNo);
                this.postSearch.changeSlideCompletely(slideNo);
            }.bind(this));
        }
    }, {
        key: 'fetchVideo',
        value: function fetchVideo(thisClass) {
            callAPI(login_origins.backend + '/getVideoInfo', "GET", { "PodcastId": this.podcastID }, function (data) {
                thisClass.audioData = {
                    "ParsedAudioTranscriptForSearch": data['ParsedAudioTranscriptForSearch'],
                    "Slides": data['Slides'],
                    "PodcastID": thisClass.podcastID
                };
                callAPI(login_origins.backend + '/getNotesForUser', "GET", { "PodcastId": thisClass.podcastID }, function (notes) {
                    thisClass.audioData["Notes"] = notes["Notes"];
                    thisClass.parseSlides(data['Slides']);
                    thisClass.loadPosts(thisClass, function () {
                        thisClass.loadVideo(thisClass, data['VideoURL'], 0, data['SRTFile']);
                    });
                });
            });
        }
    }, {
        key: 'dynamicWindowResize',
        value: function dynamicWindowResize(thisClass) {
            $(window).on("resize", function () {
                if ($(thisClass.mainDiv).length == 0) {
                    $('#myimage').off('click.mynamespace');
                } else {
                    thisClass.updatePostHeights();
                }
            });
            $(thisClass.mainDiv).bind("DOMSubtreeModified", function () {
                thisClass.updatePostHeights();
            });
        }
    }, {
        key: 'loadNavbar',
        value: function loadNavbar(thisClass) {
            require(['navbar'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#navbox");
                loadComponent("MenuModule", divToLoad, function () {
                    new NavBarLoggedInCourse(divToLoad, thisClass.podcastID);
                });
            });
        }
    }, {
        key: 'loadPosts',
        value: function loadPosts(thisClass, callback) {
            require(['postSearch'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#podcast-posts");
                loadComponent("PostSearchModule", divToLoad, function () {
                    thisClass.postSearch = new PostSearch({
                        "UniqueID": thisClass.podcastID,
                        "TypeOfFetch": "PodcastSearch"
                    }, {
                        "Name": thisClass.UserName,
                        "Pic": thisClass.UserPic
                    }, divToLoad, thisClass.audioData, {
                        "CurrentSlideNum": thisClass.startingSlide
                    }, thisClass.podcastID, function () {
                        setTimeout(function () {
                            thisClass.updatePostHeights();
                        }, 500);
                        callback();
                    }.bind(thisClass));
                    thisClass.dynamicWindowResize(thisClass);
                });
            });
        }
    }, {
        key: 'loadVideo',
        value: function loadVideo(thisClass, url, startTime, srtFile) {
            require(['video-wrapper'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#video-space");

                loadComponent("VideoModule", divToLoad, function () {
                    thisClass.videoClass = new videoClass(url, 0, divToLoad, srtFile, thisClass.slideTimes, function () {
                        thisClass.getSlideClicks();
                        thisClass.videoClass.setTime(thisClass.getTimeForSlide(thisClass.startingSlide));
                        thisClass.updateSlideNumberFromVideo();
                        thisClass.loadingCallback();
                    });
                });
            });
        }
    }, {
        key: 'loadRecommendations',
        value: function loadRecommendations(mainDiv) {
            var thisClass = this;
            require(['recommendations'], function () {
                var rec_div = $(mainDiv).find('#recommendations-container');

                loadComponent('RecommendationsModule', rec_div, function () {
                    new Recommendations(mainDiv, thisClass.podcastID);
                });
            });
        }
    }, {
        key: 'nextPreVideoListeners',
        value: function nextPreVideoListeners() {
            //this.slideTimes
            //this.getSlideForTime
        }
    }, {
        key: 'updateSlideNumberFromVideo',
        value: function updateSlideNumberFromVideo() {
            $(this.mainDiv).find("#video-space").on("slideChange", function (ev, newSlide) {
                this.postSearch.updateCurrentVideoSlide(newSlide);
            }.bind(this));
        }
    }, {
        key: 'updatePostHeights',
        value: function updatePostHeights() {
            var newHeight = $(window).height() - $(this.mainDiv).find("#navbox").height();
            $(this.mainDiv).find("#podcast-posts").css("height", newHeight);
        }
    }]);

    return PodcastPage;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoyMor = function () {
    function BoyMor(needle) {
        _classCallCheck(this, BoyMor);

        this.needle = needle;
        this.charTable = this.makeCharTable(needle);
        this.offsetTable = this.makeOffsetTable(needle);
    }

    _createClass(BoyMor, [{
        key: "bmIndexOf",
        value: function bmIndexOf(haystack) {
            var needle = this.needle;
            if (needle.length == 0) {
                return 0;
            }

            for (var i = needle.length - 1, j; i < haystack.length;) {
                for (j = needle.length - 1; needle.charAt(j) == haystack.charAt(i); --i, --j) {
                    if (j == 0) {
                        return i;
                    }
                }
                // i += needle.length - j; // For naive method
                i += Math.max(this.offsetTable[needle.length - 1 - j], this.charTable[haystack.charAt(i)]);
            }
            return -1;
        }

        /**
         * Makes the jump table based on the mismatched character information.
         */

    }, {
        key: "makeCharTable",
        value: function makeCharTable(needle) {
            var table = [];
            var length = 65535;
            for (var i = 0; i < length; ++i) {
                table.push(needle.length);
            }
            for (var i = 0; i < needle.length - 1; ++i) {
                //if(needle.charAt(i) < length){
                table[needle.charAt(i)] = needle.length - 1 - i;
                //}
            }
            return table;
        }

        /**
         * Makes the jump table based on the scan offset which mismatch occurs.
         */

    }, {
        key: "makeOffsetTable",
        value: function makeOffsetTable(needle) {
            var table = [];
            var length = needle.length;

            for (var i = 0; i < length; i++) {
                table.push(0);
            }
            var lastPrefixPosition = needle.length;
            for (var i = needle.length - 1; i >= 0; --i) {
                if (this.isPrefix(needle, i + 1)) {
                    lastPrefixPosition = i + 1;
                }
                table[needle.length - 1 - i] = lastPrefixPosition - i + needle.length - 1;
            }
            for (var i = 0; i < needle.length - 1; ++i) {
                var slen = this.suffixLength(needle, i);
                table[slen] = needle.length - 1 - i + slen;
            }
            return table;
        }

        /**
         * Is needle[p:end] a prefix of needle?
         */

    }, {
        key: "isPrefix",
        value: function isPrefix(needle, p) {
            for (var i = p, j = 0; i < needle.length; ++i, ++j) {
                if (needle.charAt(i) != needle.charAt(j)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Returns the maximum length of the substring ends at p and is a suffix.
         */

    }, {
        key: "suffixLength",
        value: function suffixLength(needle, p) {
            var len = 0;
            for (var i = p, j = needle.length - 1; i >= 0 && needle.charAt(i) == needle.charAt(j); --i, --j) {
                len += 1;
            }
            return len;
        }
    }]);

    return BoyMor;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PodcastDropdownMenu = function () {

    // Dropdown shows all the slides
    // Unanswered questions (questions with no comments)
    // Notes
    // All slides (deafult search?)
    // Search made (connect this method with the podcast page)
    // By default SHOWS ALL POSTS IN LECTURE

    function PodcastDropdownMenu(numSlides, divOfDropdown) {
        _classCallCheck(this, PodcastDropdownMenu);

        this.mainDiv = divOfDropdown;
        this.numSlides = numSlides;
        this.dropdownMenuOptions = $(this.mainDiv).find(".dropdown-menu");
        this.slideDropdownItems = {};
        this.generateNonSlideOptions();
        this.generateDropdownForSlides();
        this.updateSlideTextListener();

        // Default value
        $(this.mainDiv).find("#dropdownSlideSelection").children("span").html("Entire Lecture");
    }

    _createClass(PodcastDropdownMenu, [{
        key: "generateNonSlideOptions",
        value: function generateNonSlideOptions() {
            var nonSlideOptions = ["Entire Lecture", "Unresolved Posts", "My Notes"];
            for (var x = 0; x < nonSlideOptions.length; x++) {
                var nextOpt = this.generateDropdownWithType(nonSlideOptions[x]);
                this.slideDropdownItems[nextOpt[x]] = nextOpt;
                this.dropdownMenuOptions.append(nextOpt);
            }
        }
    }, {
        key: "generateDropdownForSlides",
        value: function generateDropdownForSlides() {

            // Slides are one-indexed
            for (var x = 1; x <= this.numSlides; x++) {
                var nextSlide = this.generateOneDropdownForSlide(x);
                this.slideDropdownItems[x] = nextSlide;
                this.dropdownMenuOptions.append(nextSlide);
            }
        }
    }, {
        key: "updateSlideTextListener",
        value: function updateSlideTextListener() {
            $(this.mainDiv).find(".dropdown-item").on("click", function (ev) {
                if ($(ev.target).html() == "Entire Lecture") {
                    $(this.mainDiv).trigger("AllLecture", []);
                }
                if ($(ev.target).html() == "Unresolved Posts") {
                    $(this.mainDiv).trigger("UnresolvedLecture", []);
                }
                if ($(ev.target).html() == "My Notes") {
                    $(this.mainDiv).trigger("ShowNotes", []);
                }
                $(this.mainDiv).find("#dropdownSlideSelection").children("span").html($(ev.target).html());
            }.bind(this));
        }
    }, {
        key: "switchToSlide",
        value: function switchToSlide(slideNo) {
            $(this.mainDiv).find("#dropdownSlideSelection").children("span").html($(this.slideDropdownItems[slideNo]).html());
        }
    }, {
        key: "switchToAllLecture",
        value: function switchToAllLecture() {
            $(this.mainDiv).find("#dropdownSlideSelection").children("span").html("Entire Lecture");
        }
    }, {
        key: "generateDropdownWithType",
        value: function generateDropdownWithType(type) {
            return $("<a>").addClass("dropdown-item").attr("data-type", type).html(type);
        }
    }, {
        key: "generateOneDropdownForSlide",
        value: function generateOneDropdownForSlide(slideNo) {
            return $("<a>").addClass("dropdown-item").addClass("slide-no").attr("data-slide", slideNo).html("Slide " + slideNo + " Feed");
        }
    }]);

    return PodcastDropdownMenu;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    ocrAudioData 
        -Only open for Prithvi/ Allen to use, no docs needed
    {
        "ParsedAudioTranscriptForSearch":
        "Slides":
    }
*/
var OCRAudioPosts = function () {
    function OCRAudioPosts(ocrAudioData, mainDiv, loadedCallback) {
        _classCallCheck(this, OCRAudioPosts);

        this.audioPosts = [];
        this.ocrPosts = [];

        this.ocrAudioData = ocrAudioData;
        this.mainDiv = mainDiv;
        this.parseSlides();
        this.generatePosts(this, function () {
            loadedCallback();
        });

        //new OCRAudioIndPost();
    }

    _createClass(OCRAudioPosts, [{
        key: "doSearchInAudio",
        value: function doSearchInAudio(query) {
            if (query.trim().length == 0) {
                this.hideTable(this.audioPost);
                return true;
            }

            var foundAnything = false;
            for (var x = 0; x < this.audioPosts.length; x++) {
                var nextQuery = this.audioPosts[x].checkForContent(query);
                foundAnything = foundAnything || nextQuery;
            }
            if (!foundAnything) {
                this.hideTable(this.audioPost);
                return false;
            } else {
                this.showTable(this.audioPost);
                return true;
            }
        }
    }, {
        key: "doSearchInOCR",
        value: function doSearchInOCR(query) {
            if (query.trim().length == 0) {
                this.hideTable(this.ocrPost);
                return true;
            }

            var foundAnything = false;
            for (var x = 0; x < this.ocrPosts.length; x++) {
                var nextQuery = this.ocrPosts[x].checkForContent(query);
                foundAnything = foundAnything || nextQuery;
            }
            if (!foundAnything) {
                this.hideTable(this.ocrPost);
                return false;
            } else {
                this.showTable(this.ocrPost);
                return true;
            }
        }
    }, {
        key: "doSlideCheckInAudio",
        value: function doSlideCheckInAudio(slideNum) {}
    }, {
        key: "doSlideCheckInOCR",
        value: function doSlideCheckInOCR(slideNum) {}
    }, {
        key: "showTable",
        value: function showTable(element) {
            $(element).show();
        }
    }, {
        key: "hideTable",
        value: function hideTable(element) {
            $(element).hide();
        }
    }, {
        key: "generatePosts",
        value: function generatePosts(thisClass, callback) {
            thisClass.generatePostForAudio(thisClass, function () {
                thisClass.generatePostForOCR(thisClass, function () {
                    callback();
                });
            });
        }
    }, {
        key: "generatePostForAudio",
        value: function generatePostForAudio(thisClass, callback) {
            loadHTMLComponent("AudioOCRMod", function (data) {
                var myDomData = $(data);
                $(myDomData).find(".type-of-ocr").html("Audio Transcription Search");
                var toInsertPos = $(thisClass.mainDiv).find(".no-results");
                $(myDomData).insertAfter(toInsertPos);
                thisClass.audioPost = myDomData;
                thisClass.generateIndividualPostsForAudio(myDomData, thisClass);
                thisClass.hideTable(myDomData);
                callback();
            });
        }
    }, {
        key: "generateIndividualPostsForAudio",
        value: function generateIndividualPostsForAudio(mainDom, thisClass) {
            var audioData = thisClass.ocrAudioData["ParsedAudioTranscriptForSearch"];
            for (var x = 0; x < audioData.length; x++) {
                thisClass.audioPosts.push(new OCRAudioIndPost(audioData[x]["Content"], thisClass.getSlideForTime(audioData[x]["StartTime"]), mainDom, audioData[x]["StartTime"]));
            }
        }
    }, {
        key: "generatePostForOCR",
        value: function generatePostForOCR(thisClass, callback) {
            loadHTMLComponent("AudioOCRMod", function (data) {
                var myDomData = $(data);
                $(myDomData).find(".type-of-ocr").html("Slide Search");
                var toInsertPos = $(thisClass.mainDiv).find(".no-results");
                $(myDomData).insertAfter(toInsertPos);
                thisClass.ocrPost = myDomData;
                thisClass.generateIndividualPostsForOCR(myDomData, thisClass);
                thisClass.hideTable(myDomData);
                callback();
            });
        }
    }, {
        key: "generateIndividualPostsForOCR",
        value: function generateIndividualPostsForOCR(mainDom, thisClass) {
            var slideData = thisClass.ocrAudioData["Slides"];
            for (var x = 0; x < slideData.length; x++) {
                thisClass.ocrPosts.push(new OCRAudioIndPost(slideData[x]["OCRTranscription"], slideData[x]["SlideNum"], mainDom, null));
            }
        }
    }, {
        key: "parseSlides",
        value: function parseSlides() {
            var slides = this.ocrAudioData['Slides'];

            // Note that the slides themselves are indexed starting at 1
            var slideTimes = [];
            for (var x = 0; x < slides.length; x++) {
                slideTimes.push(slides[x]["StartTime"] / 1000);
            }
            this.slideTimes = slideTimes;
        }
    }, {
        key: "getTimeForSlide",
        value: function getTimeForSlide(slideNum) {
            if (slideNum <= 0) {
                console.error("Remember that slide numbers start at 1, not 0");
                return 0;
            }
            slideNum -= 1;
            if (slideNum >= this.slideTimes.length) return 0;else return this.slideTimes[slideNum];
        }
    }, {
        key: "getSlideForTime",
        value: function getSlideForTime(timeValueInSeconds) {
            var targetSlide = this.getSlideForTimeHelper(this.slideTimes, function (x) {
                return x - timeValueInSeconds;
            });
            return targetSlide + 1; // slides start at index 1!!
        }
    }, {
        key: "getSlideForTimeHelper",
        value: function getSlideForTimeHelper(arr, compare) {
            var l = 0,
                r = arr.length - 1;
            while (l <= r) {
                var m = l + (r - l >> 1);
                var comp = compare(arr[m]);
                if (comp < 0) // arr[m] comes before the element
                    l = m + 1;else if (comp > 0) // arr[m] comes after the element
                    r = m - 1;else // arr[m] equals the element
                    return m;
            }
            return l - 1; // return the index of the next left item
            // usually you would just return -1 in case nothing is found
        }
    }]);

    return OCRAudioPosts;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APost = function () {
    function APost(postData, userData, mainDiv, shouldAllowNewComments) {
        _classCallCheck(this, APost);

        // Set up globals
        this.postData = postData;
        this.userData = userData;

        // DOM elements
        this.mainDiv = $(mainDiv);
        this.commentDiv = $(this.mainDiv).find(".comments");
        this.commentForm = $(this.mainDiv).find(".comment-form");
        this.numOfComments = this.postData["Comments"].length;

        this.loadHeader(this.postData["Name"], this.postData["ProfilePic"]);
        this.loadMainContent(this.postData["Content"], this.postData["TimeOfPost"], this.postData["SlideOfPost"]);
        this.loadCommentContent(this, this.postData["Comments"]);
        this.postID = this.postData["PostId"];

        if (shouldAllowNewComments) {
            this.addCommentListener(this);
        } else {
            $(this.commentForm).hide();
        }

        if (this.postData && this.postData.LectureDate) {
            this.generateClickableLecturePost(this.postData.LectureDate);
        }
    }

    _createClass(APost, [{
        key: "generateClickableLecturePost",
        value: function generateClickableLecturePost(lectureDate) {
            var slideDiv = $(this.mainDiv).find(".slide-no");
            $(slideDiv).html($(slideDiv).html() + " - " + moment(lectureDate).format("MMM Do")).attr("data-podcast", this.postData.PodcastId);
        }
    }, {
        key: "addCommentListener",
        value: function addCommentListener(thisClass) {
            $(this.commentForm).on("submit", function (ev) {
                ev.preventDefault();
                thisClass.addComment($(thisClass.mainDiv).find(".comment-answer"), thisClass.userData["Pic"], thisClass.userData["Name"], new Date().getTime());
            });
        }
    }, {
        key: "getNumComments",
        value: function getNumComments() {
            return this.numOfComments;
        }
    }, {
        key: "addComment",
        value: function addComment(inputForm, userPic, userName, timeOfComment) {
            var obj = {
                "Content": $(inputForm).val(),
                "Time": timeOfComment,
                "PostId": this.postID
            };
            callAPI(login_origins.backend + "/createComment", "POST", obj, function () {
                this.loadIndividualComment({
                    "Pic": userPic,
                    "PosterName": userName,
                    "Content": $(inputForm).val(),
                    "Time": timeOfComment
                });
                this.numOfComments++;
                $(this.mainDiv).trigger("commentAdded", []);
                $(inputForm).val("");
            }.bind(this));
        }
    }, {
        key: "searchForContent",
        value: function searchForContent(searchTerm) {
            var isSearch = $(this.mainDiv).is(':contains("' + searchTerm + '")');
            if (isSearch) {
                this.showThisPost();
                return true;
            } else {
                this.hideThisPost();
                return false;
            }
        }
    }, {
        key: "fetchBySlide",
        value: function fetchBySlide(slideNo) {
            var isGoodSlide = $($(this.mainDiv).find(".slide-no")).is(':contains("Slide ' + slideNo + '")');
            if (isGoodSlide) {
                this.showThisPost();
                return true;
            } else {
                this.hideThisPost();
                return false;
            }
        }
    }, {
        key: "hideThisPost",
        value: function hideThisPost() {
            $(this.mainDiv).hide();
        }
    }, {
        key: "showThisPost",
        value: function showThisPost() {
            $(this.mainDiv).show();
        }
    }, {
        key: "loadHeader",
        value: function loadHeader(name, pic) {
            $(this.mainDiv).find(".profile-pic-post").attr("src", pic);
            $(this.mainDiv).find(".name-of-poster").find("span").html(name);
        }
    }, {
        key: "loadMainContent",
        value: function loadMainContent(content, time, slideOfPost) {
            var timeString = moment(new Date(time), "YYYYMMDD").fromNow();
            $(this.mainDiv).find(".time-sig-nat-lang").html(timeString);

            this.slideNo = slideOfPost;

            $(this.mainDiv).find(".slide-no").html("Slide " + slideOfPost).attr("data-slide", slideOfPost);

            $(this.mainDiv).find(".post-main-content").find("span").html(content);
        }
    }, {
        key: "loadCommentContent",
        value: function loadCommentContent(thisClass, comments) {
            loadHTMLComponent("CommentModule", function (data) {
                thisClass.commentModule = data;

                for (var x = 0; x < comments.length; x++) {
                    thisClass.loadIndividualComment(comments[x]);
                }
            });
        }
    }, {
        key: "loadIndividualComment",
        value: function loadIndividualComment(commentData) {
            var newComment = $(this.commentModule);
            $(newComment).find(".comment-pic-holder").attr("src", commentData["Pic"]);
            $(newComment).find(".comment-poster-name").html(commentData["PosterName"]);
            $(newComment).find(".comment-post-content").html(commentData["Content"]);
            $(newComment).find(".comment-time").html(moment(new Date(commentData["Time"]), "YYYYMMDD").fromNow());
            $(this.commentDiv).append(newComment);
        }
    }]);

    return APost;
}();

/* Sample call

new APost(
    {"Name": "Rauhmel Bob",
     "ProfilePic": "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg", 
     "Content": "This is a test post with some random data just to test the functionality", 
     "TimeOfPost": 1486659593882, 
     "SlideOfPost": 5,
     "Comments": [
     {
        "Pic" : "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg",
        "PosterName" : "Rauhmel Tob",
        "Content" : "This is a really cool test commement",
        "Time" : 1486691019627
     },
     {
        "Pic" : "http://3.bp.blogspot.com/-AMQ283sRFI4/VeMuQ2FeLdI/AAAAAAAC_4k/cWfG1Hmg4d8/s1600/Miley_Cyrus_E%2521_NEWS.jpg",
        "PosterName" : "LOL Bob",
        "Content" : "This is a really cool test commement and it is going to be abbsurdley long to test a weird edge case that wil hopefully not break everything",
        "Time" : 1486691009627
     }
     ]
    }, "Prithvi Narasimhan", "http://pages.stern.nyu.edu/~sbp345/websys/phonegap-facebook-plugin-master/src/android/facebook/FacebookLib/res/drawable/com_facebook_profile_picture_blank_square.png", null, $(".post-container"))

*/
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    new PostSearch(
        {"UniqueID": "1", "TypeOfFetch": "PodcastSearch"},
        {"Name": "Prithvi Narasimhan", "Pic": "http://pages.stern.nyu.edu/~sbp345/websys/phonegap-facebook-plugin-master/src/android/facebook/FacebookLib/res/drawable/com_facebook_profile_picture_blank_square.png"},
        $(".search-module")
    )*/
var PostSearch = function () {

    /*
        Parameters:
            postFetchData (JSON Object, make sure all keys and values are valid)
                {
                    UniqueID: // unqiue id to query database with
                    TypeOfFetch: "CourseGlobal" (course home page --> unqiue id is courseid)
                                 "PodcastSearch" (podcast page --> unique id is podcastid)
                                 "CourseSearch" (course search --> unique id is course id)
                    SearchQuery: String // only required for CourseSearch
                }
             userData (JSON Object, make sure all keys and values are valid)
                {
                    Name: String,
                    Pic: String
                } // DB will be uploaded by user session token
             mainDiv (jquery object containing element where all elements on this page interact with)
    
            ocrAudioData --> again optional parameter
                -Only open for Prithvi/ Allen to use, no docs needed
            {
                "ParsedAudioTranscriptForSearch":
                "Slides":
            }
              <TODO> must implement still last paramtere stuff
            videoData (optional parameter if the video has already started playing)
                IF NOT USING, PLEASE PASS AS NULL, DONT PASS EMPTY JSON OBJECT PLZ
                {
                    CurrentSlideNum:
                }
    
             callback forwhen post page is loaded (only for post page)
     */
    function PostSearch(postFetchData, userData, mainDiv, ocrAudioData, videoData, podcastid, callback) {
        _classCallCheck(this, PostSearch);

        this.currWord = 0;
        this.postFetchData = postFetchData;
        this.userData = userData;
        this.mainDiv = $(mainDiv).find(".search-module");
        this.doneLoading = callback;
        this.podcastid = podcastid; // ONLY NEEDED FOR POST PAGE

        this.slideTransitionDiv = $(this.mainDiv).parent().find(".rectangle").hide();
        $(this.slideTransitionDiv).hide();

        // Default to current slide as one
        this.posts = [];

        this.currentViewData = {
            "PageType": "Lecture" // could also be Notes, Lecture, Unanswered
            //"SlideNo": 1    // only if SlideNo called, tohewrise slide defaults to video slide
        };

        if (videoData != null && videoData.CurrentSlideNum != null) {
            this.videoCurrentSlide = videoData.CurrentSlideNum;
            this.currentViewData.SlideNo = this.videoCurrentSlide;
        }

        this.setUpSlideTransitionModule();

        // DOM Elements
        this.searchModule = $(this.mainDiv).parent().find(".search-module");
        this.noResultsOption = $(this.mainDiv).find(".no-results");
        this.searchInputForm = $(this.mainDiv).prev();
        this.searchInputField = $(this.searchInputForm).find("#secondary-search-bar");
        this.viewAllPostsButton = $(this.mainDiv).find(".all-posts-view");
        this.newPostButton = $(this.mainDiv).prev().find(".new-post-img");
        this.loadingModule = $(this.mainDiv).parent().find("#slide-transition-data");
        this.notesWrapper = $(this.mainDiv).find(".notes-module");
        this.loadingModule.hide();
        // Package loads
        this.mark = new Mark($(this.searchModule)[0]);

        // DOM Interactions in constructor
        $(this.noResultsOption).hide();
        if (ocrAudioData) {
            this.ocrModule = new OCRAudioPosts(ocrAudioData, this.mainDiv, function () {
                this.OCRAudioLoaded = true;
            }.bind(this));
            this.numberOfSlides = ocrAudioData.Slides.length;

            loadHTMLComponent("NotesModule", function (data) {
                var notesDiv = $(this.mainDiv).find(".notes-module").html(data);
                this.notesModule = $(notesDiv).find(".notes-wrapper");
                this.notes = new Notes($(this.notesModule), ocrAudioData.Notes, this.podcastid);
                this.showNotes();
            }.bind(this));
        } else {
            $(this.mainDiv).on("click", ".post-container", function (ev) {
                var target = ev.currentTarget;
                var slideDiv = $(target).find(".slide-no");
                var pid = $(slideDiv).attr("data-podcast");
                var slide = $(slideDiv).attr("data-slide");

                window.location.hash = '#/podcast/' + pid + '/' + slide;
            });
        }

        this.detectTypeOfPostsToShow(); // this.shouldAllowNewComments is set here
        this.loadPostsFromServer(this);
        this.noPostsNewPostHandling(this);
        this.startFormListeners(this);

        // dropdown related stuff
        this.generateDropdownMenu();
        this.handleAllLectureTrigger();
        this.handleUnresolvedLectureTrigger();
    }

    _createClass(PostSearch, [{
        key: "getCurrentSlideOfNewPost",
        value: function getCurrentSlideOfNewPost() {
            if (this.currentViewData.PageType != "Slide") {
                return this.videoCurrentSlide;
            } else {
                return this.currentViewData.SlideNo;
            }
        }
    }, {
        key: "noPostsNewPostHandling",
        value: function noPostsNewPostHandling(thisClass) {

            $(this.viewAllPostsButton).on("click", function (ev) {
                ev.preventDefault();
                thisClass.showAllPostsOfLecture();
            });

            $(this.newPostButton).on("click", function (ev) {
                var newPostVal = $(this.searchInputField).val();
                if (newPostVal.trim().length == 0) swal("Type your question in the \"Search or write a post\" search bar, and then press the post button!"); // Alert library
                else {
                        this.generateNewPost(newPostVal, new Date().getTime(), this.getCurrentSlideOfNewPost());
                    }
            }.bind(this));
        }
    }, {
        key: "changeSlideCompletely",
        value: function changeSlideCompletely(slideNo) {
            if (slideNo != this.videoCurrentSlide) {
                this.showNotifcationToUserForSlideTransition(this.videoCurrentSlide);
            } else {
                this.slideTransitionDiv.hide();
            }
            this.currentViewData = {
                "PageType": "Slide",
                "SlideNo": slideNo
            };
            this.dropdownMenu.switchToSlide(slideNo);
            this.cleanUpSearch();
            this.searchForSlide(slideNo);
        }
    }, {
        key: "handleAllLectureTrigger",
        value: function handleAllLectureTrigger() {
            $(this.mainDiv).parent().find(".dropdownOfSlide").on("AllLecture", function () {
                this.showAllPostsOfLecture();
            }.bind(this));
        }
    }, {
        key: "handleUnresolvedLectureTrigger",
        value: function handleUnresolvedLectureTrigger() {
            $(this.mainDiv).parent().find(".dropdownOfSlide").on("UnresolvedLecture", function () {
                this.showAllPostsUnresolved();
            }.bind(this));
        }
    }, {
        key: "showAllPostsUnresolved",
        value: function showAllPostsUnresolved() {
            this.currentViewData = {
                "PageType": "Unanswered"
            };
            this.updateCurrentVideoSlide();
            this.cleanUpSearch();
            this.findUnresolved();
        }
    }, {
        key: "showAllPostsOfLecture",
        value: function showAllPostsOfLecture() {
            this.currentViewData = {
                "PageType": "Lecture"
            };
            $(this.searchInputField).val("");
            this.dropdownMenu.switchToAllLecture();
            this.searchByText("");
            this.updateCurrentVideoSlide();
        }
    }, {
        key: "cleanUpSearch",
        value: function cleanUpSearch() {
            this.currWord = 0;
            this.notesWrapper.hide();
            $(this.searchInputField).val("");
            this.searchNoText();
            this.mark.unmark();
        }

        // Optional param

    }, {
        key: "updateCurrentVideoSlide",
        value: function updateCurrentVideoSlide(slideNo) {
            if (slideNo) this.videoCurrentSlide = slideNo;
            if (this.currentViewData.PageType != "Slide") {
                this.showNotifcationToUserForSlideTransition(this.videoCurrentSlide);
            } else if (this.currentViewData.SlideNo != this.videoCurrentSlide) {
                this.showNotifcationToUserForSlideTransition(this.videoCurrentSlide);
            }
            /*
            Add slide transition code here
            if (this.currentViewData["PageType"] != "Slide") {
                return this.videoCurrentSlide
            }
            else {
                return this.currentViewData['SlideNo'];
            }*/
        }
    }, {
        key: "showNotifcationToUserForSlideTransition",
        value: function showNotifcationToUserForSlideTransition(slideNo) {
            this.slideTransitionDiv.show();
            this.slideTransitionDiv.find(".rectangle-notif-slide-data").html("Slide " + slideNo).attr("data-slide", slideNo);
        }
    }, {
        key: "startFormListeners",
        value: function startFormListeners(thisClass) {
            if (!this.OCRAudioLoaded) {
                setTimeout(function () {
                    this.startFormListeners(this);
                }.bind(this), 500);
                return;
            }

            if (this.doneLoading) {
                this.doneLoading();
            }

            $(this.searchInputForm).on("submit", function (ev) {
                ev.preventDefault();
                if ($(this.searchInputField).val().length > 1) {
                    this.loadingModule.show();
                    this.searchByText($(this.searchInputField).val());
                } else if ($(this.searchInputField).val().trim().length == 0) this.searchByText("");
            }.bind(this));
            $(this.searchInputField).on("input", function (ev) {
                var inputVal = $(this.searchInputField).val();

                ev.preventDefault();
                if (inputVal.length > 1) {
                    this.currWord = inputVal;
                    setTimeout(function (input) {
                        this.loadingModule.show();
                        if (input == this.currWord) {
                            this.searchByText(input);
                        }
                    }.bind(this, inputVal), 200);
                } else if (inputVal.trim().length == 0) this.searchByText("");
            }.bind(this));
        }
    }, {
        key: "detectTypeOfPostsToShow",
        value: function detectTypeOfPostsToShow() {
            if (this.postFetchData.TypeOfFetch != "PodcastSearch") {
                $(this.mainDiv).parent().find(".dropdownOfSlide").parent().hide();
                $(this.mainDiv).parent().find(".dropdownOfSlide").css("padding", 0).hide();
                $(this.mainDiv).parent().find(".main_search_container_post").css("padding", 0).hide();
                $(this.mainDiv).parent().find(".search-module-main").css("padding-top", 0);
                $(this.searchModule).css("border", "none");
                this.shouldAllowNewComments = false;
            } else {
                this.shouldAllowNewComments = true;
            }
        }
    }, {
        key: "generateNewPost",
        value: function generateNewPost(text, timeOfPost, slideOfPost) {
            var obj = {
                "PodcastId": this.podcastid,
                "SlideOfPost": slideOfPost,
                "TimeOfPost": timeOfPost,
                "Content": text
            };
            callAPI(login_origins.backend + "/createPost", "POST", obj, function (postID) {
                var newPost = {
                    "Name": this.userData.Name,
                    "PostId": postID, // get from callback
                    "ProfilePic": this.userData.Pic,
                    "Content": text,
                    "TimeOfPost": timeOfPost,
                    "SlideOfPost": slideOfPost,
                    "Comments": []
                };

                $(this.searchInputField).val("");
                this.loadPost(this, newPost, true);
                this.showAllPostsOfLecture();
            }.bind(this));
        }
    }, {
        key: "showNotes",
        value: function showNotes() {
            this.currentViewData = {
                "PageType": "Notes"
            };
            $(this.mainDiv).parent().find(".dropdownOfSlide").on("ShowNotes", function () {
                this.changeSlideCompletely();
                this.cleanUpSearch();
                this.notesWrapper.show();
                $(this.noResultsOption).hide();
            }.bind(this));
        }
    }, {
        key: "searchForSlide",
        value: function searchForSlide(slideNo) {
            var anyPostsShown = false;
            $(this.noResultsOption).hide();
            for (var x = 0; x < this.posts.length; x++) {
                anyPostsShown = this.posts[x].fetchBySlide(slideNo) || anyPostsShown;
            }
            if (!anyPostsShown) {
                if (!$(this.noResultsOption).is(":visible")) $(this.noResultsOption).fadeIn();
            }
        }
    }, {
        key: "findUnresolved",
        value: function findUnresolved() {
            var anyPostsShown = false;
            $(this.noResultsOption).hide();
            for (var x = 0; x < this.posts.length; x++) {
                if (this.posts[x].getNumComments() == 0) {
                    this.posts[x].showThisPost();
                    anyPostsShown = true;
                } else this.posts[x].hideThisPost();
            }
            if (!anyPostsShown) {
                if (!$(this.noResultsOption).is(":visible")) $(this.noResultsOption).fadeIn();
            }
        }
    }, {
        key: "setUpSlideTransitionModule",
        value: function setUpSlideTransitionModule() {
            loadHTMLComponent("SlideTransitionModule", function (data) {
                $(this.mainDiv).parent().find("#slide-transition-data").html(data);
            }.bind(this));
        }
    }, {
        key: "searchNoText",
        value: function searchNoText() {
            this.mark.unmark();
            this.currentTextBeingSearched = 0;
            for (var x = 0; x < this.posts.length; x++) {
                this.posts[x].hideThisPost();
            }
            this.ocrModule.doSearchInAudio("");
            this.ocrModule.doSearchInOCR("");
        }
    }, {
        key: "searchByText",
        value: function searchByText(text) {
            this.mark.unmark();
            this.notesWrapper.hide();
            var bm = new BoyMor(text.toUpperCase());

            this.currentTextBeingSearched = text;

            var anyPostsShown = false;
            for (var x = 0; x < this.posts.length; x++) {
                var hasPostsShown = this.posts[x].searchForContent(text);
                anyPostsShown = anyPostsShown || hasPostsShown;
            }
            var audioResults = this.ocrModule.doSearchInAudio(text);
            var ocrResults = this.ocrModule.doSearchInOCR(text);
            anyPostsShown = anyPostsShown || audioResults || ocrResults;
            if (!anyPostsShown) {
                if (!$(this.noResultsOption).is(":visible")) $(this.noResultsOption).fadeIn();
            } else {
                this.mark.mark(text, {
                    "caseSensitive": false,
                    "separateWordSearch": false,
                    "exclude": [".pre-slide-data", ".slide-no"]
                });
                $(this.noResultsOption).hide();
            }

            setTimeout(function () {
                this.loadingModule.hide();
            }.bind(this), 500);
        }
    }, {
        key: "remarkText",
        value: function remarkText() {
            if (this.currentTextBeingSearched != null && this.currentTextBeingSearched != 0) {
                this.mark.unmark();
                this.mark.mark(this.currentTextBeingSearched, {
                    "caseSensitive": false,
                    "separateWordSearch": false,
                    "exclude": [".pre-slide-data", ".slide-no"]
                });
            }
        }
    }, {
        key: "generateDropdownMenu",
        value: function generateDropdownMenu() {
            if (this.postFetchData.TypeOfFetch == "PodcastSearch") {
                this.dropdownMenu = new PodcastDropdownMenu(this.numberOfSlides, $(this.mainDiv).parent().find(".dropdownOfSlide"));
            }
        }
    }, {
        key: "loadPostsFromServer",
        value: function loadPostsFromServer(thisClass) {
            var postData = this.postFetchData;

            // Default to podcast search assumption
            var apiURL = login_origins.backend + "/getPostsForLecture";
            var requestData = {
                "PodcastId": postData.UniqueID
            };

            if (postData.TypeOfFetch == "CourseGlobal") {
                apiURL = login_origins.backend + "/getPostsForCourse";
                requestData = {
                    "CourseId": postData.UniqueID
                };
            } else if (postData.TypeOfFetch == "CourseSearch") {
                apiURL = login_origins.backend + "/getPostsByKeyword";
                requestData = {
                    "CourseId": postData.UniqueID,
                    "Keywords": postData.SearchQuery
                };
            }

            callAPI(apiURL, "GET", requestData, function (data) {
                // An array of posts are returned
                for (var x = 0; x < data.length; x++) {
                    thisClass.loadPost(thisClass, data[x]);
                }
            });
        }
    }, {
        key: "loadPostModuleData",
        value: function loadPostModuleData(callback) {
            loadHTMLComponent("PostModule", function (data) {
                callback(data);
            });
        }
    }, {
        key: "loadPost",
        value: function loadPost(thisClass, postData, shouldPrepend) {
            thisClass.loadPostModuleData(function (postTemplate) {
                var newDiv = $(postTemplate);
                var newPostObj = new APost(postData, thisClass.userData, newDiv, thisClass.shouldAllowNewComments);

                thisClass.posts.push(newPostObj);
                if (shouldPrepend) $(thisClass.mainDiv).prepend(newDiv);else $(thisClass.mainDiv).append(newDiv);

                // Must remark the text when a comment is added
                $(newDiv).on("commentAdded", function () {
                    thisClass.remarkText();
                });
            });
        }
    }]);

    return PostSearch;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OCRAudioIndPost = function () {

    // startTime (in SECONDS) is optional and only applicable for the sub-modules
    function OCRAudioIndPost(content, slideNum, divToAppend, startTime) {
        _classCallCheck(this, OCRAudioIndPost);

        this.divToAppend = divToAppend;
        this.content = content.replace(/\n\s*\n/g, '\n');
        this.slideNum = slideNum;
        this.startTime = startTime;
        this.loadComponentAndAddData(this, function () {});
    }

    _createClass(OCRAudioIndPost, [{
        key: "loadComponentAndAddData",
        value: function loadComponentAndAddData(thisClass, callback) {
            loadHTMLComponent("AudioOCRSubMod", function (data) {
                thisClass.entireData = $(data);
                $($(thisClass.entireData)[2]).find("span").html(thisClass.content);
                thisClass.determineSlideData($(thisClass.entireData).find(".pre-slide-data"), $(thisClass.entireData).find(".slide-no"));
                $(thisClass.divToAppend).append(thisClass.entireData);
                thisClass.hideThisPost(thisClass);
                callback();
            });
        }
    }, {
        key: "ensureDataLoad",
        value: function ensureDataLoad(callback) {
            if (this.entireData != null) {
                callback();
            } else {
                this.loadComponentAndAddData(this, function () {
                    callback();
                });
            }
        }
    }, {
        key: "showThisPost",
        value: function showThisPost(thisClass) {
            setTimeout(function () {
                thisClass.ensureDataLoad(function () {
                    $(thisClass.entireData).show();
                });
            }, 0);
        }
    }, {
        key: "hideThisPost",
        value: function hideThisPost(thisClass) {
            setTimeout(function () {
                thisClass.ensureDataLoad(function () {
                    $(thisClass.entireData).hide();
                });
            }, 0);
        }
    }, {
        key: "checkForContent",
        value: function checkForContent(searchTerm) {
            var isContent = this.content.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
            if (isContent) {
                this.showThisPost(this);
                return true;
            } else {
                this.hideThisPost(this);
                return false;
            }
        }
    }, {
        key: "determineSlideData",
        value: function determineSlideData(preSlideEle, slideNoEle) {
            $(slideNoEle).attr("data-slide", this.slideNum).html("Slide " + this.slideNum);
            if (this.startTime) {
                $(preSlideEle).html("At " + this.getMinutesSecondsString());
                $(slideNoEle).attr("data-time", this.startTime);
            } else {
                $(preSlideEle).html("Found on ");
            }
        }
    }, {
        key: "getMinutesSecondsString",
        value: function getMinutesSecondsString() {
            if (this.startTime == null) return "";
            return parseInt(this.startTime / 60) + " minutes and " + parseInt(this.startTime % 60) + " seconds on ";
        }
    }]);

    return OCRAudioIndPost;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Recommendations = function () {
  function Recommendations(mainDiv, podcastid) {
    _classCallCheck(this, Recommendations);

    this.podcastid = podcastid;

    this.getRecommendations(function (recommendations, lecturedate) {

      this.displayRecomm($(mainDiv).find('.podcast-recommendations'), recommendations);
      $(mainDiv).find(".lecture-date").html(new Date(lecturedate).toDateString());
    }.bind(this));
  }

  _createClass(Recommendations, [{
    key: 'displayRecomm',
    value: function displayRecomm(rec_div, recommendations) {
      var numRecs = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = recommendations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var recommendation = _step.value;

          numRecs++;
          if (numRecs == 5) return;
          var id = recommendation['PodcastId'];
          var preview_src = recommendation['PodcastImage'];
          var title = recommendation['Time'];

          var link_anchor = document.createElement('a');
          link_anchor.href = window.location.hash.substring(0, window.location.hash.lastIndexOf('/') + 1) + id;

          var rec_container = document.createElement('div');
          $(rec_container).addClass('rec-container pure-u-6-24');

          var preview_img = document.createElement('img');
          preview_img.src = preview_src;
          $(preview_img).addClass('rec-preview-img');

          var rec_title = document.createElement('div');
          rec_title.textContent = new Date(title).toDateString();
          $(rec_title).addClass('rec-title');

          $(rec_container).append(preview_img);
          $(rec_container).append(rec_title);

          $(link_anchor).append(rec_container);
          $(rec_div).append(link_anchor);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'getRecommendations',
    value: function getRecommendations(callback) {
      callAPI(login_origins.backend + '/getRecommendations', 'GET', { "PodcastId": this.podcastid }, function (data) {
        callback(data['Recommendations'], data['Time']);
      });
    }
  }]);

  return Recommendations;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchVideosClass = function () {
  function SearchVideosClass(courseId, mainDiv, searchTerm) {
    _classCallCheck(this, SearchVideosClass);

    this.courseId = courseId;
    this.mainDiv = mainDiv;

    var masterDiv = $(this.mainDiv).find('#search-videos-div')[0];
    $(this.mainDiv).find("#title").html("Here are some videos we found about \"" + searchTerm + "\"");

    this.keywordLoadFromCrud(searchTerm, courseId, masterDiv);
    callAPI(login_origins.backend + "/searchByKeywords", "GET", { "count": 6, "CourseId": this.courseId, "Keywords": searchTerm }, function (data) {
      console.log(data);
      var overallDiv = $(this.mainDiv).find(".videos-div")[0];
      masterDiv.appendChild(overallDiv);
      overallDiv.class = 'scroll';

      var row = document.createElement('div');
      row.className = 'row videos-row';
      overallDiv.appendChild(row);

      var videos = data;
      for (var i = 0; i < videos.length; i++) {
        var curr = videos[i];
        if (row.childElementCount == 3) {
          row = document.createElement('div');
          row.className = 'row videos-row';
          overallDiv.appendChild(row);
        }
        var videoDiv = document.createElement('div');
        videoDiv.className = 'col-4';
        row.appendChild(videoDiv);

        var img = document.createElement('img');
        img.className = 'search-videos-img';
        img.src = videos[i]['PodcastImage'];
        img.addEventListener('click', function () {
          window.location.hash = '#/podcast/' + curr['PodcastId'];
        }.bind(curr));
        videoDiv.appendChild(img);

        var heading = document.createElement('p');
        heading.className = 'textUnderVid';
        heading.innerHTML = moment(videos[i]['Time']).format("ddd, MMM Do");
        videoDiv.appendChild(heading);
      }
    }.bind(this));
  }

  _createClass(SearchVideosClass, [{
    key: "keywordLoadFromCrud",
    value: function keywordLoadFromCrud(searchTerm, courseId, masterDiv) {
      callAPI(login_origins.backend + "/getKeywordSuggestions", "GET", { 'count': 50, 'minKeywordLength': 3, 'CourseId': courseId }, function (results) {
        results.sort(function () {
          return 0.5 - Math.random();
        });
        this.keywordGeneration(searchTerm, courseId, masterDiv, results);
      }.bind(this));
    }
  }, {
    key: "keywordGeneration",
    value: function keywordGeneration(searchTerm, courseId, masterDiv, results) {
      var recKeywords = $(".recClass")[0];
      for (var i = 0; i < 6; i++) {
        var recs = document.createElement('button');
        recs.innerHTML = results[i];
        recKeywords.appendChild(recs);
        var currentColor = this.fnGetRandomColour(120, 250);
        $(recs).css({ "border": "2pxsolid " + currentColor, "background-color": currentColor });
        $(recs).on("click", function (ev) {
          window.location.hash = "#/search/" + courseId + "/" + $(ev.target).html();
        });
      }
    }
  }, {
    key: "fnGetRandomColour",
    value: function fnGetRandomColour(iDarkLuma, iLightLuma) {
      for (var i = 0; i < 20; i++) {
        var sColour = ('ffffff' + Math.floor(Math.random() * 0xFFFFFF).toString(16)).substr(-6);

        var rgb = parseInt(sColour, 16); // convert rrggbb to decimal
        var r = rgb >> 16 & 0xff; // extract red
        var g = rgb >> 8 & 0xff; // extract green
        var b = rgb >> 0 & 0xff; // extract blue

        var iLuma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709


        if (iLuma > iDarkLuma && iLuma < iLightLuma) return sColour;
      }
      return sColour;
    }
  }]);

  return SearchVideosClass;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchPage = function () {
    function SearchPage(podcastID, mainDiv, searchTerm) {
        _classCallCheck(this, SearchPage);

        this.mainDiv = mainDiv;
        this.podcastID = podcastID;
        this.searchTerm = searchTerm;
        this.loadNavbar(this);
        this.loadVideos(this);
        this.loadPosts(this);
    }

    _createClass(SearchPage, [{
        key: "loadNavbar",
        value: function loadNavbar(thisClass) {
            require(['navbar'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#navbox");
                loadComponent("MenuModule", divToLoad, function () {
                    var navbar = new NavBarLoggedInCourse(divToLoad, thisClass.podcastID);
                    navbar.setValueOfSearchBar(thisClass.searchTerm);
                });
            });
        }
    }, {
        key: "loadPosts",
        value: function loadPosts(thisClass) {
            require(['postSearch'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#posts");
                loadComponent("PostSearchModule", divToLoad, function () {
                    new PostSearch({
                        "UniqueID": thisClass.podcastID,
                        "TypeOfFetch": "CourseSearch",
                        "SearchQuery": thisClass.searchTerm
                    }, {
                        "Name": thisClass.UserName,
                        "Pic": thisClass.UserPic
                    }, divToLoad);
                    thisClass.dynamicWindowResize(thisClass);
                });
            });
        }
    }, {
        key: "loadVideos",
        value: function loadVideos(thisClass) {
            require(['search-videos'], function () {
                var divToLoad = $(thisClass.mainDiv).find("#search-videos");
                loadComponent("SearchResultsModule", divToLoad, function () {
                    new SearchVideosClass(thisClass.podcastID, $(thisClass.mainDiv), thisClass.searchTerm);
                });
            });
        }
    }, {
        key: "dynamicWindowResize",
        value: function dynamicWindowResize(thisClass) {
            $(window).on("resize", function () {
                if ($(thisClass.mainDiv).length == 0) {
                    $('#myimage').off('click.mynamespace');
                } else {
                    thisClass.updateComponentHeights();
                }
            });
            $(thisClass.mainDiv).bind("DOMSubtreeModified", function () {
                thisClass.updateComponentHeights();
            });
        }
    }, {
        key: "updateComponentHeights",
        value: function updateComponentHeights() {
            var newHeight = $(window).height() - $(this.mainDiv).find("#navbox").height();
            $(this.mainDiv).find("#posts").css("height", newHeight - 35);
            $(this.mainDiv).find("#search-videos").css("height", newHeight - 35);
        }
    }]);

    return SearchPage;
}();

// var app = angular.module('podcast', []);
//
// app.controller('MainCtrl', [
// '$scope', function($scope){
//   $scope.test = 'Hello world!';
//   $scope.flag = 0;
//   console.log($scope.flag);
//   $scope.pods = []
//   $scope.chunkedArray = [];
//   counter = 0;
//
//   $scope.add = function(){
//     $scope.flag = 1;
//     counter++;
//     $scope.pods.push(counter)
//     $scope.chunk($scope.pods, $scope.pods.length)
//     console.log("pods length is: " + $scope.pods.length)
//     console.log("chunkedArray length is: " + $scope.chunkedArray.length)
//   }
//
//   $scope.chunk = function(array, size){
//     for (var i = 0; i < array.length; i+=size){
//       $scope.chunkedArray.push(array.slice(i, i+size));
//     }
//   }
//
// }]);
"use strict";

function loadCSSBasedOnURLPath(urlPath) {
    loadCSSDynamically("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css");
    loadCSSDynamically("https://fonts.googleapis.com/css?family=Roboto:300,400,700,900");
    loadCSSDynamically("https://unpkg.com/purecss@0.6.2/build/pure-min.css");
    loadCSSDynamically("http://vjs.zencdn.net/5.16.0/video-js.css");
    loadCSSDynamically("styles/video_module/index.css");
}
"use strict";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function callAJAX(mytype, url, datastruct, callback) {
    $.ajax({
        type: mytype,
        url: url,
        data: datastruct,
        success: callback,
        xhrFields: { withCredentials: true },
        error: function error() {
            console.error("ERROR");
        }
    });
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var videoClass = function () {
    function videoClass(url, timestamp, mainDiv, srtData, slides, callback) {
        _classCallCheck(this, videoClass);

        this.mainDiv = mainDiv;
        this.slides = slides;
        this.index = 0;
        var self = this;
        //this.getInfo()

        this.initWithCaptions(srtData, function () {
            self.setSource(url);
            self.setTime(timestamp);
            self.getTime();
            self.initHotKeys();
            self.initListeners();
            callback();
        });
    }

    _createClass(videoClass, [{
        key: 'initListeners',
        value: function initListeners() {
            var self = this;

            //when to change video
            this.mainDiv.on('changeVideo', function (e, deet) {
                videojs('my-video').ready(function () {});
            });

            this.timeUpdateListener(videojs('my-video'));
        }
    }, {
        key: 'setSource',
        value: function setSource(source) {
            videojs('my-video').src({ type: 'video/mp4', src: source });
            this.source = source;
        }
    }, {
        key: 'initHotKeys',
        value: function initHotKeys() {

            videojs('my-video').hotkeys({
                //  volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false,
                enableVolumeScroll: false
            });
        }
    }, {
        key: 'setTime',
        value: function setTime(time) {
            videojs('my-video').currentTime(time);
        }
    }, {
        key: 'timeUpdateListener',
        value: function timeUpdateListener(video) {
            var currentSlide = 1;
            video.ready(function () {
                video.on('timeupdate', function () {
                    var newSlide = this.getSlideForTime(video.currentTime());
                    if (newSlide != currentSlide) {
                        $(this.mainDiv).trigger("slideChange", [newSlide]);
                        currentSlide = newSlide;
                    }
                }.bind(this));
            }.bind(this));
        }
    }, {
        key: 'getSlideForTime',
        value: function getSlideForTime(timeValueInSeconds) {
            var targetSlide = this.getSlideForTimeHelper(this.slides, function (x) {
                return x - timeValueInSeconds;
            });
            return targetSlide + 1; // slides start at index 1!!
        }
    }, {
        key: 'getSlideForTimeHelper',
        value: function getSlideForTimeHelper(arr, compare) {
            var l = 0,
                r = arr.length - 1;
            while (l <= r) {
                var m = l + (r - l >> 1);
                var comp = compare(arr[m]);
                if (comp < 0) // arr[m] comes before the element
                    l = m + 1;else if (comp > 0) // arr[m] comes after the element
                    r = m - 1;else // arr[m] equals the element
                    return m;
            }
            return l - 1; // return the index of the next left item
            // usually you would just return -1 in case nothing is found
        }
    }, {
        key: 'getTime',
        value: function getTime() {
            this.mainDiv.on('getTime', function (e) {
                videojs('my-video').ready(function () {
                    var video = videojs('my-video');
                    var time = video.currentTime();
                    var minutes = Math.floor(time / 60);
                    var seconds = Math.floor(time - minutes * 60);
                    var x = minutes < 10 ? "0" + minutes : minutes;
                    var y = seconds < 10 ? "0" + seconds : seconds;
                }.bind(this));
            }.bind(this));
        }
    }, {
        key: 'initWithCaptions',
        value: function initWithCaptions(srtData, callback) {

            var f = new File([srtData], "captionFile.srt");
            var duri = URL.createObjectURL(f);

            //reinit videojs 
            if (videojs.getPlayers()['my-video']) {
                delete videojs.getPlayers()['my-video'];
            }
            videojs('my-video', {
                controls: true,
                class: 'video-js vjs-default-skin vjs-big-play-centered vjs-16-9',
                playbackRates: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
                autoplay: true,
                tracks: [{ src: duri, kind: 'captions', srclang: 'en', label: 'English' }]
            }, callback);
        }
    }]);

    return videoClass;
}();