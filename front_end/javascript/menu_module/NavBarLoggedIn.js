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
            this.setCoursesHyperLink();
            this.setHomeHyperLink(data['Id']);
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

    setCoursesHyperLink () {
        /*$(this.mainDiv).find(".classlink1").attr('href', "#/courses/" + classId);
        $(this.mainDiv).find(".classlink1").attr('style', 'text-decoration: none');

        $(this.mainDiv).find(".classlink2").attr('href', "#/courses/" + classId);
        $(this.mainDiv).find(".classlink2").attr('style', 'text-decoration: none');*/

        var windowHash = "#/courses";
        $(this.mainDiv).find("#course_button").on("click", function () {
            window.location.hash =  windowHash;
        });
    }
    
    setHomeHyperLink (classId) {
        
        /*$(this.mainDiv).find(".homelink").attr('href', windowHash);
        $(this.mainDiv).find(".homelink").attr('style', 'text-decoration: none');*/

        var windowHash = "#/courses/" + classId;
        if (classId == null) {
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
                minLength: 2,
                select: function(event, ui) { 
                    $("input#searchBar").val(ui.item.value);
                    $("#searchForm").submit();
                },
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
              });
              $("#name-logout").css({"cursor":"pointer"});
            }, 
            function () {
              $('#name-logout').fadeOut('fast', function() {
                $('#name-logout').text("Hey " + name.substring(0, name.indexOf(' ')) + "!").fadeIn('fast');
              });
            }
        );
        var setTimeoutConst;
        $('#name-logout').hover(
            function() {
                setTimeoutConst = setTimeout(function(){
                    $(self.mainDiv).find("#userProfPic").attr("src", "../../images/menu_module/gary.png").fadeIn('slow'); 
                }, 7000);
            },
            function() {
                clearTimeout(setTimeoutConst);
                $(self.mainDiv).find("#userProfPic").attr("src", pic).fadeIn('fast');  
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
