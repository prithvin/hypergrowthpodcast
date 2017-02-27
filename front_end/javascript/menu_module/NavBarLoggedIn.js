var autokeys = [];
var NavBarLoggedInCourse = class NavBarLoggedInCourse {

    // ClassID COULD EITHER BE A PODCAST OR A CLASSID IT CAN BE SOMETHINg. 
    constructor (mainDiv, classID) {
        this.mainDiv = mainDiv;

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
        this.setCoursesHyperLink(this);
    }

    fetchCourseData(classID,  callback) {
        callAPI(login_origins.backend + '/getCourseInfo', 'GET', {'CourseId': classID}, function(data) {
            callback(data['Course'], data['Quarter']);
            this.setHomeHyperLink(data['Id']);
            this.initAutocomplete(data['Id']);
        }.bind(this));
    }

    fetchUserData (callback) {
        callAPI(login_origins.backend + '/getUser', "GET", {}, function (data) {
            callback(data['Name'], data['Pic']);
            this.initLogout(data['Name']);
        }.bind(this));
    }

    setClassName(className) {
        $(this.mainDiv).find("#className").html(className);
    }

    setClassQuarter(classQuarter) {
        $(this.mainDiv).find("#classQuarter").html(classQuarter);
    }

    setPlaceHolder(className, classQuarter) {
        $(this.mainDiv).find("#searchBar").attr("placeholder", "Search in " + className + " " + classQuarter);
    }

    setUserName(userFirstName) {
        $(this.mainDiv).find("#firstName").html(userFirstName.substring(0, userFirstName.indexOf(' ')));
    }


    setProfPic (userPicture) {
        $(this.mainDiv).find("#userProfPic").attr("src", userPicture)
    }

    setCoursesHyperLink (thisClass) {
        $(this.mainDiv).find("#course_button").on("click", function () {
            var baseURL = window.location.origin + window.location.pathname;
            var targetURL = baseURL + "#/courses";
            window.location.href = targetURL;
            window.location.hash =  "/courses";
        })
    }
    
    setHomeHyperLink (classID) {
        var windowHash = "#/courses/" + classID;
        if (classID == null) {
            windowHash = "#/courses";
        }
        $(this.mainDiv).find("#home_button").on("click", function () {
            window.location.hash = windowHash;
        }.bind(this))
        $(this.mainDiv).find("#home_button2").on("click", function () {
            window.location.hash = windowHash;
        }.bind(this))
    }
    
    
    initAutocomplete(classID) {
        // Keep user searches if they are worthwhile
        document.getElementById("searchBar").addEventListener("change", function() {
            var text = document.getElementById('searchBar').value.toLowerCase();
            if ($.inArray(text, autokeys) == -1 && text.length > 2)
                autokeys.push(text);
            //console.log(autokeys);
            localStorage.setItem("autokeys", autokeys);
        });     
        
        if (classID == null) {
            return;             // we don't want a podcast id here so exit!
        }
        
        // Get Keywords for entire course
        callAPI(login_origins.backend + '/getKeywordSuggestions', "GET", {'count': 100, 'minKeywordLength': 3, 'CourseId': classID}, function (data) {
            var keys = localStorage.getItem("autokeys");
            if (keys !== null) autokeys = keys.split(",");
            // Merge keywords
            $.extend(autokeys, data);
            $("#searchBar").autocomplete({
                source: autokeys,
                minLength: 1,
                open: function () { 
                    $('ul.ui-autocomplete').addClass('opened');  
                },
                close: function () {
                    $('ul.ui-autocomplete').removeClass('opened').css('display', 'block');
                },
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    return $("<li class='li-key'></li>")
                        .data("item.autocomplete", item)
                        .append("<span class='key'>" + item.label + "</span>")
                        .appendTo(ul);;
            };    
        });
    }
    
    initLogout(name) {
        var self = this;
        $('.logout-container').hover(
            function () {
              $('#name-logout').fadeOut('fast', function() {
                $('#name-logout').text('Logout?').fadeIn('fast');
              });
              $("#name-logout").css({"cursor":"pointer"});
            }, 
            function () {
              $('#name-logout').fadeOut('fast', function() {
                $('#name-logout').text("Hey " + name.substring(0, name.indexOf(' ')) + "!").fadeIn('fast');
              });
            }
        ); 
        $('#name-logout').click(
            function() {
                self.logout();
            }
        );
    }
    
    logout() {
        console.log('Logging user out...');
        callAPI(login_origins.backend + '/logout', 'GET', {}, (data) => {
            //Redirect User to Login
             window.location.hash =  '/';
        });
    } 
}