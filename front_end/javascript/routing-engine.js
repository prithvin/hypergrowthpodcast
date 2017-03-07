require(['director', 'components', 'loader', 'config'], function () {

  function timeToHideLoader (time) {
    if (!time)
      time = 0;
    setTimeout(function () {
       $("#loader-animation").fadeOut();
    }, time);
  };

  var globalTime = 0;
  
  var callbackToCall = null;
  // Preventing random race conditions hopefully???!?!?
  function startPageLoad (callback) {
    var currentTime = new Date().getTime();
    if (currentTime - globalTime < 1000) {  // then queue up this function call and wait for a bit??
      callbackToCall = callback;
      return;
    }
    globalTime = currentTime;
    console.log("Callback");
    $("#loader-animation").show();
    callback();
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
  
     