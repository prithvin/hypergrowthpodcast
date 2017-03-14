require(['director', 'components', 'loader', 'config', 'garbageBin', 'alertbox'], function () {

  function timeToHideLoader (time) {
    if (!time)
      time = 0;
    setTimeout(function () {
       $("#loader-animation").fadeOut();
    }, time);
  };

  // keeps track of time for race condition
  var globalTime = 0;
  
  // acts as a "queue" that only holds the latest call
  var callbackToCall = null;
  var currentMainDiv = null;

  // Preventing random race conditions hopefully???!?!?
  function startPageLoad (callback) {
    var currentTime = new Date().getTime();
    if (currentTime - globalTime < 2000) {  // then queue up this function call and wait for a bit??zzzZ
      // if the callback is null, then we don't want to change the latest callback

      if (callback != null)
        callbackToCall = callback;

      setTimeout(function () {
        // calls this function recursively with a delay to check to see if the user stopped randomly
        // redirecting from page to page. does not pass in url, making callback null
        if (callbackToCall)
          startPageLoad();
        // if callbackToCall is null, that means the callbackToCall was executed, so no need
        // to recursively call
      }, 100)
      return;
    }

    // if the callback is not null, then set it to callback to call, which is next function being
    // executed
    if (callback)
      callbackToCall = callback;

    // update time right before function execution
    globalTime = currentTime;
    $("#loader-animation").show();

    // calls the latest function called, and sets the callbackToCall to null so that in the timeout
    // the funciton is not recurisvely called again!
    
    //if ($("#page").find("div")[0])
      //discardElement($("#page").find("div")[0]);
    $(currentMainDiv).remove();
    callbackToCall();
    callbackToCall = null;
  }
  var currentClass = null;

  var loginPage = function () {
    startPageLoad(function () {
      require(['onboarding'], function () {
        loadComponent("OnboardingFrontPage", $("#page"), function () {
          currentMainDiv = $('#page').find('.onboarding-page');
          currentClass = new Onboarding(currentMainDiv, function () {
            timeToHideLoader(0);
          });
        });
      });
    });
  };

  var onboardingCoursesPage = function(courses) {
    startPageLoad(function() {
      loadComponentOrLogin("OnboardingCoursesModule", $("#page"), function () {
        require(['course-selection'], function () {
          currentMainDiv = $('#page').find('.onboarding-page');
          currentClass = new OnboardingCourses(currentMainDiv);
          timeToHideLoader(1000);
        });
      });
    });
    
  }


  var podcast = function (podcastId, slide) {
    startPageLoad(function () {
      if (!slide)
        slide = 0;
      loadComponentOrLogin("PodcastModule", $("#page"), function () {
        require(['podcast'], function () {
          currentMainDiv = $("#page").find(".podcast-page-div");
          currentClass = new PodcastPage(podcastId, currentMainDiv, slide, function() {
            timeToHideLoader(10);
          });
        });
      });
    });
  };

  var search = function (courseId, searchTerm) {
    startPageLoad(function () {
      searchTerm = decodeURIComponent(searchTerm);
      require(['searchResults'], function () {
        loadComponentOrLogin("CourseSearchModule", $("#page"), function () {
          currentMainDiv = $("#page").find(".search-results-div");
          currentClass = new SearchPage(courseId, currentMainDiv, searchTerm);
          timeToHideLoader(1000);
        });
      });
    });
  };

  var courseHomepage = function(courseId) {
    startPageLoad(function () {
      loadComponentOrLogin("CourseHomepageModule", $("#page"), function() {
        require(['course-homepage'], function() {
          currentMainDiv = $("#page").find(".course-homepage-div");
          currentClass = new CourseHomepageClass(courseId, currentMainDiv , function() {
            timeToHideLoader(1000);
          });
        });
      });
    });
  }

  var otherPages = function() {
    swal({
      title: "Error 404",
      text: "This page does not exist. ",
      type: "warning",
      showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ok",
      closeOnConfirm: false
    }, function () {
      swal("Cool!", "Check out some of the courses here!", "success");
      window.location.hash = "#/courses"
    });
  }

  var routes = {
    '/podcast/:podcastId': podcast,
    '/podcast/:podcastId/:slide': podcast,
    '/search/:courseId/:searchTerm': search,
    '': loginPage,
    '/courses/:courseId': courseHomepage,
    '/courses': onboardingCoursesPage,
    '/courses?((\w|.)*)': onboardingCoursesPage,
    '/?((\w|.)*)': otherPages
  };

  var router = Router(routes);

  // Scripts above are required on every single page

  loadComponent("LoaderModule", $("#loader-animation"), function () {
    setTimeout(function () {
      router.init('/');
    }, 20);
  });
});
  
     