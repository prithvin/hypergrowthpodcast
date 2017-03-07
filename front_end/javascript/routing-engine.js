require(['director', 'components', 'loader', 'config', 'garbageBin'], function () {

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

  // Preventing random race conditions hopefully???!?!?
  function startPageLoad (callback) {
    var currentTime = new Date().getTime();

    if (currentTime - globalTime < 1000) {  // then queue up this function call and wait for a bit??

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
      }, 50)
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

    callbackToCall();
    callbackToCall = null;
  }


  var loginPage = function () {
    startPageLoad(function () {
      require(['onboarding'], function () {
        loadComponent("OnboardingFrontPage", $("#page"), function () {
          new Onboarding($('#page').find('.onboarding-page'));
          timeToHideLoader(1000);
        });
      });
    });
  };

  var onboardingCoursesPage = function(courses) {
    startPageLoad(function() {
      loadComponentOrLogin("OnboardingCoursesModule", $("#page"), function () {
        require(['course-selection'], function () {
          new OnboardingCourses($("#page").find(".onboarding-courses-page"));
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
          new PodcastPage(podcastId, $("#page").find(".podcast-page-div"), slide, function() {
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
          new SearchPage(courseId, $("#page").find(".search-results-div"), searchTerm);
          timeToHideLoader(1000);
        });
      });
    });
  };

  var courseHomepage = function(courseId) {
    startPageLoad(function () {
      loadComponentOrLogin("CourseHomepageModule", $("#page"), function() {
        require(['course-homepage'], function() {
          new CourseHomepageClass(courseId, $("#page").find(".course-homepage-div"), function() {
            timeToHideLoader(1000);
          });
        });
      });
    });
  }

  var otherPages = function() {
    alert("This page is not found");
  }

  var routes = {
    '/podcast/:podcastId': podcast,
    '/podcast/:podcastId/:slide': podcast,
    '/search/:courseId/:searchTerm': search,
    '/': loginPage,
    '': loginPage,
    '/courses/:courseId': courseHomepage,
    '/courses': onboardingCoursesPage,
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
  
     