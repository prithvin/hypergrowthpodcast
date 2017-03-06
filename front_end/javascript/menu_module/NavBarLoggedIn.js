var autokeys = [];
var NavBarLoggedInCourse = class NavBarLoggedInCourse {

    // ClassID COULD EITHER BE A PODCAST OR A CLASSID IT CAN BE SOMETHINg. 
    constructor (mainDiv, classID) {
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

    fetchCourseData(classID,  callback) {
        callAPI(login_origins.backend + '/getCourseInfo', 'GET', {'CourseId': classID}, function(data) {
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

    listenToUserSearch () {
        $(this.mainDiv).find(".main_search_container").on("submit", function (ev) {
            ev.preventDefault();
            if ($(this.mainDiv).find("#searchBar").val().trim().length != 0)
                window.location.hash = "#/search/" + this.classID + "/" + encodeURIComponent($(this.mainDiv).find("#searchBar").val());
        }.bind(this));
    }

    fetchUserData (callback) {
        callAPI(login_origins.backend + '/getUser', "GET", {}, function (data) {
            callback(data['Name'], data['Pic']);
            this.initLogout(data['Name'], data['Pic']);
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

    setValueOfSearchBar(newValue) {
        $(this.mainDiv).find("#searchBar").val(newValue);
    }

    setUserName(userFirstName) {
        $(this.mainDiv).find("#firstName").html(userFirstName.substring(0, userFirstName.indexOf(' ')));
    }


    setProfPic (userPicture) {
        $(this.mainDiv).find("#userProfPic").attr("src", userPicture)
    }

    setCoursesHyperLink (classId) {
        $(this.mainDiv).find("#course_button").on("click", function () {
            var windowHash = "#/courses/" + classId;
            if (classId == null) {
                windowHash = "#/courses";
            }
            window.location.hash =  windowHash;
        });
    }
    
    setHomeHyperLink () {
        var windowHash = "#/courses";
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
                minLength: 2,
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
    
    initLogout(name, pic) {
        var self = this;
        $('.logout-container').hover(
            function () {
              $('#name-logout').fadeOut('fast', function() {
                $('#name-logout').text('Logout?').fadeIn('slow');
                $('#name-logout').hover(
                    function() {
                        setTimeout(function(){
                            $(self.mainDiv).find("#userProfPic").attr("src", "https://scontent-lax3-1.xx.fbcdn.net/v/t34.0-12/16143998_1739808612715955_116693742_n.png?oh=f17324b879d30a47943267d5608afcbd&oe=58C05B5F").fadeIn('slow'); 
                        }, 7000);
                    },
                    function() {
                        $(self.mainDiv).find("#userProfPic").attr("src", pic).fadeIn('fast');  
                    }
                );
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
        callAPI(login_origins.backend + '/logout', 'GET', {}, (data) => {
          //Redirect User to Login
          window.location.hash = '/';
        });
    } 
}
